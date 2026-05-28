import axios from "axios";
import crypto from "crypto";
import { getAbdmToken } from "./abdmSessionManager.js";

let cachedPublicKeyPem = null;
let keyExpiryTime = null;

/**
 * Fetches and formats the ABDM public certificate for encryption
 */
async function getAbdmPublicKey() {
  const now = Date.now();
  // Cache the key for 1 hour
  if (cachedPublicKeyPem && keyExpiryTime && now < keyExpiryTime) {
    return cachedPublicKeyPem;
  }

  const abhaApiUrl = process.env.ABHA_API_URL || "https://abhasbx.abdm.gov.in/abha/api";
  const sessionToken = await getAbdmToken();

  try {
    const response = await axios.get(`${abhaApiUrl}/v3/profile/public/certificate`, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        "REQUEST-ID": crypto.randomUUID(),
        TIMESTAMP: new Date().toISOString(),
        "X-CM-ID": "sbx",
      },
    });

    const publicKeyBase64 = response.data.publicKey;
    if (!publicKeyBase64) {
      throw new Error("No publicKey in response from ABDM public certificate API");
    }

    // Format raw base64 to PEM public key format
    const formattedKey = publicKeyBase64.match(/.{1,64}/g).join("\n");
    cachedPublicKeyPem = `-----BEGIN PUBLIC KEY-----\n${formattedKey}\n-----END PUBLIC KEY-----`;
    keyExpiryTime = now + 60 * 60 * 1000; // Cache for 1 hour
    
    console.log("🔒 [ABDM Crypto] Successfully fetched and cached Gateway public certificate.");
    return cachedPublicKeyPem;
  } catch (error) {
    console.error("❌ [ABDM Crypto Certificate Error]:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * Encrypts a string using the ABDM public key with RSA/ECB/OAEPWithSHA-1AndMGF1Padding
 * @param {string} dataToEncrypt - Plaintext data (Aadhaar, OTP, or mobile)
 */
export async function encryptData(dataToEncrypt) {
  try {
    const pemPublicKey = await getAbdmPublicKey();
    const buffer = Buffer.from(dataToEncrypt, "utf8");

    const encrypted = crypto.publicEncrypt(
      {
        key: pemPublicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: "sha1",
      },
      buffer
    );

    return encrypted.toString("base64");
  } catch (error) {
    console.error("❌ [ABDM Encryption Failed]:", error.message);
    throw error;
  }
}
