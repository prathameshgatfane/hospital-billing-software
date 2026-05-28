import axios from "express"; // Wait, we should import axios directly! Let's import axios.
import axiosDirect from "axios";
import crypto from "crypto";

let cachedToken = null;
let tokenExpiryTime = null;

const uuidv4 = () => crypto.randomUUID();

export async function getAbdmToken() {
  const now = Date.now();
  if (cachedToken && tokenExpiryTime && now < tokenExpiryTime) {
    return cachedToken;
  }

  const clientId = process.env.ABDM_CLIENT_ID;
  const clientSecret = process.env.ABDM_CLIENT_SECRET;
  const gatewayUrl = process.env.ABDM_GATEWAY_URL || "https://dev.abdm.gov.in";

  try {
    const response = await axiosDirect.post(
      `${gatewayUrl}/api/hiecm/gateway/v3/sessions`,
      {
        clientId: clientId,
        clientSecret: clientSecret,
        grantType: "client_credentials"
      },
      {
        headers: {
          "Content-Type": "application/json",
          "REQUEST-ID": uuidv4(),
          "TIMESTAMP": new Date().toISOString(),
          "X-CM-ID": "sbx"
        }
      }
    );

    if (response.data && response.data.accessToken) {
      cachedToken = response.data.accessToken;
      // ExpiresIn is typically in seconds, e.g. 600. Keep a buffer of 30 seconds.
      const expiresIn = response.data.expiresIn || 600;
      tokenExpiryTime = now + (expiresIn - 30) * 1000;
      console.log("🔑 [ABDM Session] Token generated successfully. Expires in:", expiresIn, "seconds.");
      return cachedToken;
    } else {
      throw new Error("No accessToken returned from ABDM sessions API");
    }
  } catch (error) {
    console.error("❌ [ABDM Session Error]:", error.response?.data || error.message);
    throw error;
  }
}
