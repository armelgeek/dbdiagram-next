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

interface PasswordResetEmailProps {
  verificationUrl: string;
  userName?: string;
}

export const PasswordResetEmailTemplate = ({
  verificationUrl,
  userName
}: PasswordResetEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Reset your {kAppName} password</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={headerTitle}>{kAppName}</Heading>
          </Section>

          {/* Reset Section */}
          <Section style={resetSection}>
            <Text style={resetIcon}>🔑</Text>
            <Heading style={resetTitle}>Reset Your Password</Heading>
            <Text style={resetMessage}>
              We received a request to reset your password. No worries, it happens to the best of us!
            </Text>
          </Section>

          {/* Content */}
          <Section style={contentSection}>
            <Text style={greeting}>Hello {userName || 'there'},</Text>
            <Text style={messageText}>
              Someone (hopefully you!) has requested a password reset for your {kAppName} account. 
              If this was you, click the button below to create a new password. If not, 
              you can safely ignore this email.
            </Text>
            
            <Section style={buttonSection}>
              <Button style={resetButton} href={verificationUrl}>
                Reset My Password
              </Button>
            </Section>
            
            <Text style={linkText}>
              Or copy and paste this link in your browser:<br />
              <a href={verificationUrl} style={linkStyle}>{verificationUrl}</a>
            </Text>
            
            <Hr style={divider} />
            
            <Section style={securitySection}>
              <Text style={securityTitle}>🛡️ Security Tips</Text>
              <Text style={securityText}>
                • This reset link will expire in 1 hour for your security<br />
                • Choose a strong, unique password that you haven&apos;t used before<br />
                • Consider using a password manager to keep your accounts secure<br />
                • If you didn&apos;t request this reset, please contact our support team
              </Text>
            </Section>
            
            <Section style={helpSection}>
              <Text style={helpTitle}>Need Help?</Text>
              <Text style={helpText}>
                If you&apos;re having trouble with your account or didn&apos;t request this password reset, 
                our support team is here to help. Contact us at support@{kAppName.toLowerCase()}.com
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              This password reset was requested for your {kAppName} account. If you didn&apos;t make this request, 
              please ignore this email or contact support if you have concerns.
            </Text>
            <Text style={footerContact}>
              {kAppName} Security Team | support@{kAppName.toLowerCase()}.com
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

const resetSection = {
  padding: "40px 40px 20px",
  textAlign: "center" as const,
};

const resetIcon = {
  fontSize: "48px",
  margin: "0 0 16px 0",
};

const resetTitle = {
  color: "#1f2937",
  fontSize: "24px",
  fontWeight: "600",
  margin: "0 0 16px 0",
};

const resetMessage = {
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

const resetButton = {
  backgroundColor: "#dc2626",
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

const securitySection = {
  backgroundColor: "#f3f4f6",
  padding: "16px",
  borderRadius: "8px",
  marginBottom: "24px",
};

const securityTitle = {
  color: "#1f2937",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const securityText = {
  color: "#6b7280",
  fontSize: "14px",
  lineHeight: "20px",
  margin: "0",
};

const helpSection = {
  backgroundColor: "#fef3cd",
  padding: "16px",
  borderRadius: "8px",
  borderLeft: "4px solid #f59e0b",
};

const helpTitle = {
  color: "#92400e",
  fontSize: "14px",
  fontWeight: "600",
  margin: "0 0 8px 0",
};

const helpText = {
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

export default PasswordResetEmailTemplate;
