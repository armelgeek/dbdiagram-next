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

interface EmailChangeVerificationProps {
  verificationUrl: string;
  newEmail: string;
}

export const EmailChangeVerificationTemplate = ({
  verificationUrl,
  newEmail
}: EmailChangeVerificationProps) => {
  return (
    <Html>
      <Head />
      <Preview>Verify your new email address for {kAppName}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{kAppName}</Heading>
          </Section>

          {/* Security Section */}
          <Section style={securitySection}>
            <Text style={securityIcon}>🔐</Text>
            <Heading style={securityTitle}>Email Change Verification</Heading>
            <Text style={securityMessage}>
              We need to verify your new email address to keep your account secure.
            </Text>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Text style={greeting}>Hello,</Text>
            <Text style={messageText}>
              You recently requested to change your email address to <strong>{newEmail}</strong>. 
              To complete this change and ensure the security of your account, please verify 
              your new email address by clicking the button below.
            </Text>
            
            <Section style={buttonSection}>
              <Button style={verifyButton} href={verificationUrl}>
                Verify New Email Address
              </Button>
            </Section>
            
            <Text style={linkText}>
              Or copy and paste this link in your browser:<br />
              <a href={verificationUrl} style={linkStyle}>{verificationUrl}</a>
            </Text>
            
            <Hr style={divider} />
            
            <Section style={warningSection}>
              <Text style={warningTitle}>🛡️ Security Notice</Text>
              <Text style={warningText}>
                • This verification link will expire in 1 hour<br />
                • If you didn&apos;t request this change, please ignore this email<br />
                • Your current email address will remain active until verification is complete
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This verification was requested from your {kAppName} account. If you didn&apos;t make this request, 
              please contact our support team immediately.
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

const securitySection = {
  padding: "40px 40px 20px",
  textAlign: "center" as const,
};

const securityIcon = {
  fontSize: "48px",
  margin: "0 0 16px 0",
};

const securityTitle = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const securityMessage = {
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

const warningSection = {
  backgroundColor: "#fef3cd",
  padding: "16px",
  borderRadius: "8px",
  borderLeft: "4px solid #f59e0b",
};

const warningTitle = {
  color: "#92400e",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const warningText = {
  color: "#92400e",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
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

export default EmailChangeVerificationTemplate;
