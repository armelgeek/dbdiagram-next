import { kAppName } from "@/shared/lib/constants/app.constant";
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from "@react-email/components";

interface WelcomeEmailProps {
  userName: string;
  verificationUrl: string;
}

export const WelcomeEmail = ({
  userName,
  verificationUrl
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to {kAppName} - Verify your email to get started!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{kAppName}</Heading>
          </Section>

          {/* Welcome Section */}
          <Section style={welcomeSection}>
            <Text style={welcomeIcon}>👋</Text>
            <Heading style={welcomeTitle}>Welcome to {kAppName}!</Heading>
            <Text style={welcomeMessage}>
              We&apos;re excited to have you join our community.
            </Text>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Text style={greeting}>Hello {userName},</Text>
            <Text style={messageText}>
              Thank you for creating an account with {kAppName}! To get started and ensure the security
              of your account, please verify your email address by clicking the button below.
            </Text>
            
            <Section style={buttonSection}>
              <Button style={verifyButton} href={verificationUrl}>
                Verify Email Address
              </Button>
            </Section>
            
            <Text style={linkText}>
              Or copy and paste this link in your browser:<br />
              <a href={verificationUrl} style={linkStyle}>{verificationUrl}</a>
            </Text>
            
            <Hr style={divider} />
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              If you didn&apos;t create this account, you can safely ignore this email.
            </Text>
            <Text style={footerContact}>
              Questions? Contact us at support@{kAppName.toLowerCase()}.com
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
};

const header = {
  padding: "20px 40px",
  backgroundColor: "#f97316",
  textAlign: "center" as const,
};

const headerTitle = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const welcomeSection = {
  padding: "40px 40px 20px",
  textAlign: "center" as const,
};

const welcomeIcon = {
  fontSize: "48px",
  margin: "0 0 16px 0",
};

const welcomeTitle = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const welcomeMessage = {
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0",
};

const contentSection = {
  padding: "20px 40px",
};

const greeting = {
  color: "#1f2937",
  fontSize: "16px",
  margin: "0 0 16px 0",
};

const messageText = {
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "24px",
  margin: "0 0 24px 0",
};

const buttonSection = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const verifyButton = {
  backgroundColor: "#f97316",
  borderRadius: "6px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 24px",
  border: "none",
};

const linkText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "24px 0",
  textAlign: "center" as const,
};

const linkStyle = {
  color: "#f97316",
  textDecoration: "underline",
  wordBreak: "break-all" as const,
};

const divider = {
  borderColor: "#e5e7eb",
  margin: "32px 0",
};

const benefitsTitle = {
  color: "#1f2937",
  fontSize: "16px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const benefitsList = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0 0 24px 0",
};

const footer = {
  padding: "20px 40px",
  textAlign: "center" as const,
  borderTop: "1px solid #e5e7eb",
  marginTop: "32px",
};

const footerText = {
  color: "#6b7280",
  fontSize: "14px",
  margin: "0 0 8px 0",
};

const footerContact = {
  color: "#9ca3af",
  fontSize: "12px",
  margin: "0",
};

export default WelcomeEmail;
