// components/DocumentHead.js
import {
  DEFAULT_TITLE,
  DEFAULT_DESC,
  NEXT_PUBLIC_APP_URL,
} from "@/public/settings/there_is_nothing_holding_me_back/config";

const DocumentHead = () => {
  // Yeh sirf default meta tags set karega
  return (
    <>
      <meta charSet="utf-8" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon.png" />
      <link rel="shortcut icon" href="/favicon.png" />
      <link rel="apple-touch-icon" href="/favicon.png" />
      <link rel="image_src" href="/favicon.png" />
      <link href="/css/fontawesome-all.css" rel="stylesheet" />
      <link href="/css/flaticon.css" rel="stylesheet" />
      <link href="/bootstrap.min.css" rel="stylesheet" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta
        name="google-site-verification"
        content="DlPj7CVm0pxZExMMnC37egWVigS0ZQf9_nfvNAY9E0Q"
      />
    </>
  );
};

export default DocumentHead;
