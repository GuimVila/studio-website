import React from "react";
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
  title?: string;
  previewText?: string;
  introText?: string;
  buttonText?: string;
};

export default function ConfirmSubscription({
  confirmUrl,
  siteName,
  title = "Confirma la teva subscripció",
  previewText = "Confirma la teva subscripció",
  introText,
  buttonText = "Confirmar subscripció",
}: Props) {
  const brand = siteName ?? "Newsletter";
  const intro =
    introText ?? `Gràcies per subscriure’t a la meva Newsletter. Fes clic per confirmar.`;

  return React.createElement(
    Html,
    null,
    React.createElement(Head, null),
    React.createElement(Preview, null, previewText),
    React.createElement(
      Body,
      { style: styles.body },
      React.createElement(
        Container,
        { style: styles.container },
        React.createElement(Heading, { style: styles.h1 }, title),
        React.createElement(Text, { style: styles.p }, intro),
        React.createElement(
          Button,
          { href: confirmUrl, style: styles.button },
          buttonText
        ),
        React.createElement(Hr, { style: styles.hr }),
        React.createElement(
          Text,
          { style: styles.small },
          "Si no has estat tu, pots ignorar aquest correu."
        ),
        React.createElement(
          Text,
          { style: styles.tiny },
          "Si el botó no funciona, copia i enganxa aquest enllaç al navegador:",
          React.createElement("br", null),
          React.createElement(
            "a",
            { href: confirmUrl, style: styles.link },
            confirmUrl
          )
        )
      )
    )
  );
}

const styles: Record<string, Record<string, string>> = {
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
    backgroundColor: "#D08A3F",
    color: "#0b1220",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "800",
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
    margin: "0",
  },
  link: {
    color: "#93c5fd",
    textDecoration: "underline",
    wordBreak: "break-all",
  },
};
