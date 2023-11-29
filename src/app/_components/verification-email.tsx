import { type FC } from "react";

interface EmailTemplateProps {
  firstName: string;
  verificationToken: string;
  domainUrl: string;
}

export const VerificationEmail: FC<Readonly<EmailTemplateProps>> = ({
  firstName,
  verificationToken,
  domainUrl,
}) => (
  <div>
    <h1>Welcome to Tasqboard, {firstName}!</h1>
    <p>Please verify your email address by clicking the link below.</p>
    <a href={`${domainUrl}/auth/verify-email?token=${verificationToken}`}>
      Verify Email
    </a>
  </div>
);
