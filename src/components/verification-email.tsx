import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Button,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  verificationToken?: string;
  baseUrl?: string;
}

export const VerificationEmail = ({
  verificationToken,
  baseUrl,
}: VerificationEmailProps) => (
  <Html>
    <Head />
    <Preview>Welcome to Tasqboard</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>Confirm your email address</Heading>
        <Text style={heroText}>
          Please confirm your email address by clicking the button below.
        </Text>

        <Button
          href={`${baseUrl}/auth/verify-email?token=${verificationToken}`}
          style={{
            backgroundColor: "#000",
            color: "#ffffff",
            padding: "10px",
            borderRadius: "5px",
          }}
          target="_blank"
        >
          Confirm email address
        </Button>

        <Text style={text}>
          If you didn't request this email, there's nothing to worry about - you
          can safely ignore it.
        </Text>
        <Section>
          <Link
            style={footerLink}
            href="https://chirag.is-a.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About Me
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href="https://github.com/ChiragAgg5k"
            target="_blank"
            rel="noopener noreferrer"
          >
            My GitHub
          </Link>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <Link
            style={footerLink}
            href={`https://www.linkedin.com/in/chiragagg5k/`}
            target="_blank"
            rel="noopener noreferrer"
            data-auth="NotApplicable"
            data-linkindex="6"
          >
            LinkedIn
          </Link>
          <Text style={footerText}>
            ©2023 ChiragAgg5k, Computer Science student from India. <br />
            All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default VerificationEmail;

const footerText = {
  fontSize: "12px",
  color: "#b7b7b7",
  lineHeight: "15px",
  textAlign: "left" as const,
  marginBottom: "50px",
};

const footerLink = {
  color: "#b7b7b7",
  textDecoration: "underline",
};

const main = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
};

const container = {
  maxWidth: "600px",
  margin: "0 auto",
};

const h1 = {
  color: "#1d1c1d",
  fontSize: "36px",
  fontWeight: "700",
  margin: "30px 0",
  padding: "0",
  lineHeight: "42px",
};

const heroText = {
  fontSize: "20px",
  lineHeight: "28px",
  marginBottom: "30px",
};

const text = {
  color: "#000",
  fontSize: "14px",
  lineHeight: "24px",
};
