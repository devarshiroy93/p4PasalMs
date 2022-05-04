import otpGenerator from 'otp-generator';

export class OtpManager {
    static generateOtp() {
      return  otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
    }
}