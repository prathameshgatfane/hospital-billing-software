Client Hospital OR Doctor

/api/client/register (minimal) with otp

1 Register User 
 post http://localhost:5012/api/client/register
{
  "hospitalName": "cloickinnovate Hospital",
  "doctorName": "Dr. ayush khakare",
  "contactNumber": "9359002018",
  "email": "ayushkhakare2018@gmail.com",
  "password": "ayush@123"
} 


 {"message":"OTP sent to email. Please verify to continue."}

----------------------------------------------------------------------------------------------

2 Verify OTP
 post http://localhost:5012/api/client/verify-otp  
 {
  "email": "ayushkhakare2018@gmail.com",
  "otp": "529239"
}
 {"message":"Email verified successfully. You can now login."} 

-----------------------------------------------------------------------------------------------------

 3 Resend OTP when expire or some resone
  post http://localhost:5012/api/client/resend-otp

 {
  "email": "ayushkhakare2018@gmail.com"
}

{"message": "New OTP sent to email"}

--------------------------------------------------------------------------

4  user Login  
post  http://localhost:5012/api/client/login
 {
  "email": "ayushkhakare2018@gmail.com",
  "password": "Ayush@123"
}

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDEyYjc4YzkyZTFhMjYxNTMyMjhiZCIsInR5cGUiOiJjbGllbnQiLCJ0ZW5hbnRJZCI6IjY5NDEyYjc4YzkyZTFhMjYxNTMyMjhiZCIsImlhdCI6MTc2NTg4ODEyNCwiZXhwIjoxNzY1OTc0NTI0fQ.5M2ipHueUozzpoXUjMVvDTAhRP64CXUZwbY6cC8OrCc","registrationStage":"BASIC","accountStatus":"ACTIVE"}

----------------------------------------------------------------------------------------------------------

5 Forget Password and get otp
 post http://localhost:5012/api/client/forgot-password

{
  "email": "ayushkhakare2018@gmail.com"
}
{"message":"Password reset OTP sent to email"}

----------------------------------------------------------------

6   Reset Password
 post http://localhost:5012/api/client/reset-password
 
 {
  "email": "ayushkhakare2018@gmail.com",
  "otp": "981731",
  "newPassword": "ayush@123"
}

{"message":"Password reset OTP sent to email"}

-----------------------------------------------------------------

7 Update the Profile Data after the register and login
POST http://localhost:5012/api/profile/save

{
  "serviceType": "BOTH",
  "purchaseName": "Ayush Khakare",
  "secondaryMobile": "9000000000",
  "alternateEmail": "info@clickinnovate.in",
  "address": "Lonar, Maharashtra, India",
  "pincode": "443302",
  "latitude": 19.9855,
  "longitude": 76.5202,
  "hospitalRegistrationNumber": "MH-HOSP-2025-001",
  "doctorRegistrationNumber": "DOC-MH-8899",
  "hospitalImages": [
    "https://cdn.cloudinary.com/hospital1.jpg"
  ],
  "hospitalCertificates": [
    "https://cdn.cloudinary.com/hospital-cert.pdf"
  ],
  "doctorCertificates": [
    "https://cdn.cloudinary.com/doctor-cert.pdf"
  ],
  "agreementAccepted": true
}

{"success":true,"message":"Hospital profile updated successfully","profile":{"_id":"694155832a0c53a01e93f3b7","isActive":true,"tenantId":"69412b78c92e1a26153228bd","__v":0,"address":"Lonar, Maharashtra, India","agreementAccepted":true,"alternateEmail":"info@clickinnovate.in","createdAt":"2025-12-16T12:50:12.250Z","doctorCertificates":["https://cdn.cloudinary.com/doctor-cert.pdf"],"doctorRegistrationNumber":"DOC-MH-8899","hospitalCertificates":["https://cdn.cloudinary.com/hospital-cert.pdf"],"hospitalImages":["https://cdn.cloudinary.com/hospital1.jpg"],"hospitalRegistrationNumber":"MH-HOSP-2025-001","latitude":19.9855,"longitude":76.5202,"pincode":"443302","purchaseName":"Ayush Khakare","secondaryMobile":"9000000000","serviceType":"BOTH","updatedAt":"2025-12-16T12:50:12.250Z"}}

-------------------------------------------------------------------------------------------------------------------------------------


8 Get the all detail of the hospital profile 
GET http://localhost:5012/api/profile/me


{"success":true,"message":"Hospital profile updated successfully","profile":{"_id":"694155832a0c53a01e93f3b7","isActive":true,"tenantId":"69412b78c92e1a26153228bd","__v":0,"address":"Lonar, Maharashtra, India","agreementAccepted":true,"alternateEmail":"info@clickinnovate.in","createdAt":"2025-12-16T12:50:12.250Z","doctorCertificates":["https://cdn.cloudinary.com/doctor-cert.pdf"],"doctorRegistrationNumber":"DOC-MH-8899","hospitalCertificates":["https://cdn.cloudinary.com/hospital-cert.pdf"],"hospitalImages":["https://cdn.cloudinary.com/hospital1.jpg"],"hospitalRegistrationNumber":"MH-HOSP-2025-001","latitude":19.9855,"longitude":76.5202,"pincode":"443302","purchaseName":"Ayush Khakare","secondaryMobile":"9000000000","serviceType":"BOTH","updatedAt":"2025-12-16T12:50:12.250Z"}}

-----------------------------------------------------------------

9 After the client login get profile 

GET http://localhost:5012/api/client/client-me

{
  "success": true,
  "client": {
    "hospitalName": "City Care Hospital",
    "doctorName": "Dr. Rajesh Sharma",
    "contactNumber": "9876543210",
    "email": "citycare@gmail.com",
    "accountStatus": "ACTIVE",
    "registrationStage": "BASIC"
  }
}

------------------------------------------------------

10 edit the doctor name and email only 

PUT http://localhost:5012/api/client/client-me-update

{
  "doctorName": "Dr. Rajesh Kumar",
  "email": "newemail@gmail.com"
}

{
  "success": true,
  "message": "Doctor name updated. OTP sent to new email for verification"
}


-----------------------------------------------------------

11  Verify new email OTP when email chnage 
POST http://localhost:5012/api/client/verify-email-change

{
  "otp": "123456"
}

{
  "success": true,
  "message": "Email updated and verified successfully"
}

--------------------------------------------------------------------

12 Image upload the Imagekit when fill the form
POST http://localhost:5012/api/upload/image



Date - 20/12/2025

13 CLIENT → SEND MESSAGE (TEXT ONLY)
POST http://localhost:5012/api/profile/conversation/send


{
  "message": "I have submitted all documents. Please verify."
}


{
  "message": "I have submitted all documents. Please verify."
}

--------------------------------------------------------------------

14  CLIENT → SEND MESSAGE WITH ATTACHMENT (IMAGE / PDF)
POST http://localhost:5012/api/profile/conversation/send

{
  "message": "Uploading my hospital registration certificate",
  "attachments": [
    {
      "fileUrl": "https://ik.imagekit.io/mapvon/hospital/cert.pdf",
      "fileType": "PDF",
      "fileName": "hospital-cert.pdf"
    }
  ]
}

{
  "success": true,
  "message": "Message sent to admin"
}
-----------------------------------------------------------------------


15  CLIENT → GET MY VERIFICATION CONVERSATION
GET http://localhost:5012/api/profile/conversation/me

{
  "success": true,
  "verificationStatus": "PENDING",
  "conversation": [
    {
      "sender": "CLIENT",
      "message": "Uploading my hospital registration certificate",
      "attachments": [
        {
          "fileUrl": "https://ik.imagekit.io/mapvon/hospital/cert.pdf",
          "fileType": "PDF",
          "fileName": "hospital-cert.pdf"
        }
      ],
      "sentAt": "2025-12-18T10:30:00.000Z"
    }
  ]
}



------------------------------------------------------------------------
Date 23/12/2025

16  Used in doctor add form dropdown (speciality & sub-speciality).
GET http://localhost:5012/api/doctor/specialties


{"success":true,"specialties":[{"name":"General Physician","subSpecialties":[]},{"name":"Cardiology","subSpecialties":["Interventional Cardiology","Pediatric Cardiology"]},{"name":"Orthopedic","subSpecialties":["Joint Replacement","Spine Specialist"]},{"name":"Gynecology","subSpecialties":["Obstetrics","Infertility"]},{"name":"Pediatrics","subSpecialties":["Neonatology"]},{"name":"Dermatology","subSpecialties":["Cosmetology","Trichology"]}]}


---------------------------------------------------------------------------------------

17  Hospital adds a doctor 
POST http://localhost:5012/api/doctor/add

{
  "fullName": "Dr. Amit Kulkarni",
  "mobile": "9876543210",
  "email": "amit.kulkarni@gmail.com",
  "doctorRegistrationNumber": "DOC-MH-889900",
  "experienceYears": 8,
  "speciality": "Orthopedic",
  "subSpeciality": "Joint Replacement",
  "charges": {
    "opdConsultation": 500,
    "opdFollowUp": 300,
    "ipdVisit": 1000,
    "emergency": 1500
  },
  "documents": {
    "degreeCertificates": [
      "https://ik.imagekit.io/mapvon/docs/degree1.pdf"
    ],
    "registrationCertificate": "https://ik.imagekit.io/mapvon/docs/reg.pdf",
    "profilePhoto": "https://ik.imagekit.io/mapvon/photos/doctor.jpg"
  },
  "agreementAccepted": true
}


-----------------------------------------------------------------------

18 Hospital dashboard → show added doctors + status
GET http://localhost:5012/api/doctor/my

{
  "success": true,
  "count": 1,
  "doctors": [
    {
      "_id": "65fa9b2d9c0b3a...",
      "fullName": "Dr. Amit Kulkarni",
      "speciality": "Orthopedic",
      "subSpeciality": "Joint Replacement",
      "verificationStatus": "PENDING",
      "verifiedByAdmin": false,
      "isActive": true
    }
  ]
}


------------------------------------------------------------------------

19 CLIENT – GET ACTIVE & APPROVED DOCTORS (FOR BILLING)

GET http://localhost:5012/api/doctor/active


---------------------------------------------------------------------------------


visual for the Client steps
REGISTER ───► LOGIN ───► OTP VERIFY ───► DASHBOARD
                                  │
                                  └──► COMPLETE PROFILE ───► BILLING


---------------------------------------------------------------------------------
Admin



1 Admin Register (one time)
POST http://localhost:5012/api/admin/register
  {
  "name": "Super Admin",
  "email": "admin@billing.com",
  "password": "Admin@123"
}

---------------------------------------------------

2 Admin Login
POST http://localhost:5012/api/admin/login

Header
Content-Type: application/json

{
  "email": "admin@billing.com",
  "password": "Admin@123"
}

{"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5NDExZmFjMDY0NjI3OTk0MDM4NmFkNyIsInR5cGUiOiJhZG1pbiIsImlhdCI6MTc2NTk2NjI2NSwiZXhwIjoxNzY2MDUyNjY1fQ.zPyygMPi7g7sXfobXIMKKQDcA_EdX2c3i6ApapevTsA"}

-----------------------------------------------


3 Admin delete only hospital
DELETE http://localhost:5012/api/profile/admin/:tenantId

Header Authorization: Bearer ADMIN_JWT_TOKEN 

{
  "success": true,
  "message": "Hospital profile deactivated by admin"
}

-------------------------------------------------


4 Get all pending hospital to the verify 
GET http://localhost:5012/api/profile/admin/pending

Header Authorization: Bearer ADMIN_JWT_TOKEN

{
  "success": true,
  "count": 1,
  "profiles": [
    {
      "_id": "694155832a0c53a01e93f3b7",
      "tenantId": "69412b78c92e1a26153228bd",
      "verificationStatus": "PENDING",
      "serviceType": "BOTH",
      "address": "Lonar, Maharashtra, India",
      "createdAt": "2025-12-16T12:50:12.250Z"
    }
  ]
}

-------------------------------------------------------

5 Admin Approve hospital 
POST http://localhost:5012/api/profile/admin/approve/id

{
  "success": true,
  "message": "Hospital profile approved"
}

-------------------------------------------------------

6 Admin Reject  Hospital Profile 
POST http://localhost:5012/api/profile/admin/reject/id

Authorization: Bearer ADMIN_JWT_TOKEN

{
  "success": true,
  "message": "Hospital profile rejected"
}

---------------------------------------------------------------


7 Admin create the client and Without OTP registration only 
 POST http://localhost:5012/api/admin/create-client

 Authorization: Bearer ADMIN_JWT_TOKEN
Content-Type: application/json

{
  "hospitalName": "City Care Hospital",
  "doctorName": "Dr. Rajesh Sharma",
  "contactNumber": "9876543210",
  "email": "citycare@gmail.com",
  "password": "City@123"
}


{
  "success": true,
  "message": "Client created by admin successfully",
  "client": {
    "id": "65a7e...",
    "email": "citycare@gmail.com",
    "hospitalName": "City Care Hospital"
  }
}



8 ADMIN – View full profile
GET http://localhost:5012/api/profile/admin/view/id

Authorization: Bearer ADMIN_TOKEN

{
  "success": true,
  "client": {
    "hospitalName": "ClickInnovate Hospital",
    "doctorName": "Dr Ayush Khakare",
    "contactNumber": "9359002018",
    "email": "info@clickinnovate.in"
  },
  "profile": {
    "serviceType": "BOTH",
    "hospitalRegistrationNumber": "MH-HOSP-2025-001",
    "verificationStatus": "PENDING"
  }
}


------------------------------------------------------------


Date 20/12/2025

9 ADMIN → SEND MESSAGE TO CLIENT
POST http://localhost:5012/api/profile/admin/conversation/:tenantId

{
  "message": "Certificate is blurred. Please upload a clearer copy."
}

{
  "success": true,
  "message": "Message sent to client"
}

-----------------------------------------------------------------------


10 ADMIN → SEND MESSAGE WITH ATTACHMENT
POST http://localhost:5012/api/profile/admin/conversation/:tenantId

{
  "message": "Please follow this sample format",
  "attachments": [
    {
      "fileUrl": "https://ik.imagekit.io/mapvon/sample/sample.pdf",
      "fileType": "PDF",
      "fileName": "sample-format.pdf"
    }
  ]
}

{
  "success": true,
  "message": "Message sent to client"
}

------------------------------------------------------------------------

11 ADMIN → VIEW CONVERSATION OF A CLIENT
GET http://localhost:5012/api/profile/admin/conversation/:tenantId


{
  "success": true,
  "verificationStatus": "PENDING",
  "conversation": [
    {
      "sender": "CLIENT",
      "message": "Uploading my hospital registration certificate",
      "attachments": [
        {
          "fileUrl": "https://ik.imagekit.io/mapvon/hospital/cert.pdf",
          "fileType": "PDF",
          "fileName": "hospital-cert.pdf"
        }
      ],
      "sentAt": "2025-12-18T10:30:00.000Z"
    },
    {
      "sender": "ADMIN",
      "message": "Certificate is blurred. Please upload again.",
      "attachments": [],
      "sentAt": "2025-12-18T10:35:00.000Z"
    }
  ]
}

-----------------------------------------------------------------

12 Admin GET all Approved Hospital
GET http://localhost:5012/api/profile/approved

{
  "success": true,
  "count": 2,
  "hospitals": [
    {
      "tenantId": "69412b78c92e1a26153228bd",
      "hospitalName": "City Care Hospital",
      "doctorName": "Dr. Rajesh Sharma",
      "contactNumber": "9876543210",
      "email": "citycare@gmail.com",
      "serviceType": "BOTH",
      "address": "Lonar, Maharashtra, India",
      "pincode": "443302",
      "latitude": 19.9855,
      "longitude": 76.5202,
      "hospitalImages": [
        "https://ik.imagekit.io/mapvon/hospital1.jpg"
      ],
      "verifiedAt": "2025-12-18T09:30:00.000Z"
    }
  ]
}

-----------------------------------------------------------------------

Date 23/12/2025

13 ADMIN – GET ALL PENDING DOCTORS

GET http://localhost:5012/api/doctor/admin/pending

{
  "success": true,
  "count": 1,
  "doctors": [
    {
      "_id": "65fa9b2d9c0b3a...",
      "fullName": "Dr. Amit Kulkarni",
      "speciality": "Orthopedic",
      "verificationStatus": "PENDING",
      "tenantId": "69412b78c92e1a..."
    }
  ]
}

------------------------------------------------------------------------

14 ADMIN – APPROVE DOCTOR
POST http://localhost:5012/api/doctor/admin/approve/:doctorId

{
  "success": true,
  "message": "Doctor approved successfully"
}

------------------------------------------------------------------------

15 ADMIN – REJECT DOCTOR
POST http://localhost:5012/api/doctor/admin/reject/:doctorId

{
  "reason": "Invalid registration certificate"
}

{
  "success": true,
  "message": "Doctor rejected"
}

------------------------------------------------------------------------

16 ADMIN – GET ALL DOCTORS BY HOSPITAL (tenantId)

GET  http://localhost:5012/api/doctor/admin/hospital/:tenantId


-----------------------------------------------------------------------

17 ADMIN -ACTIVE/DEACTIVE DOCTOR

PATCH  http://localhost:5012/api/doctor/admin/toggle/:doctorId

{
  "isActive": false
}

-----------------------------------------------------------------------

18 Deactive and active hospital toggle (Hospital tenantand id)
PATCH  http://localhost:5012/api/profile/admin/toggle/:tenantId

{
  "isActive": false
}

{
  "success": true,
  "message": "Hospital deactivated successfully"
}

{
  "isActive": true
}

{
  "success": true,
  "message": "Hospital activated successfully"
}