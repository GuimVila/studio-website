import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
} from "@react-email/components";

type Props = {
  confirmUrl: string;
  siteName?: string;
};

export default function ConfirmSubscription({ confirmUrl, siteName }: Props) {
  const brand = siteName ?? "Newsletter";

  return (
    <Html>
      <Head />
      <Preview>Confirma la teva subscripció</Preview>

      <Body style={styles.body}>
        <Container style={styles.container}>
          <Heading style={styles.h1}>Confirma la teva subscripció</Heading>

          <Text style={styles.p}>
            Gràcies per subscriure’t a <strong>{brand}</strong>.
          </Text>

          <Text style={styles.p}>
            Fes clic al botó per confirmar que vols rebre els correus.
          </Text>

          <Button href={confirmUrl} style={styles.button}>
            Confirmar subscripció
          </Button>

          <Hr style={styles.hr} />

          <Text style={styles.small}>
            Si no has estat tu, pots ignorar aquest correu.
          </Text>

          <Text style={styles.tiny}>
            Si el botó no funciona, copia i enganxa aquest enllaç al navegador:
            <br />
            <a href={confirmUrl} style={styles.link}>
              {confirmUrl}
            </a>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#0b1220",
    padding: "40px 0",
    fontFamily:
      "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
  },
  container: {
    backgroundColor: "#0f172a",
    borderRadius: "14px",
    padding: "28px",
    maxWidth: "560px",
  },
  h1: {
    color: "#f8fafc",
    margin: "0 0 12px 0",
    fontSize: "24px",
    lineHeight: "1.25",
  },
  p: {
    color: "#cbd5e1",
    fontSize: "16px",
    lineHeight: "1.6",
    margin: "0 0 12px 0",
  },
  button: {
    display: "inline-block",
    backgroundColor: "#ff6b35",
    color: "#0b1220",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: 800,
    textDecoration: "none",
    marginTop: "8px",
  },
  hr: {
    borderColor: "rgba(148, 163, 184, 0.25)",
    margin: "22px 0",
  },
  small: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: "0 0 10px 0",
  },
  tiny: {
    color: "#94a3b8",
    fontSize: "12px",
    lineHeight: "1.6",
    margin: 0,
  },
  link: {
    color: "#93c5fd",
    textDecoration: "underline",
    wordBreak: "break-all",
  },
};
