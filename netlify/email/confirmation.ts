/**
 * The waiting-list confirmation email.
 *
 * Table-based HTML with inline styles, from the design handed over as assets;
 * images are served from our own origin at /email/ (public/email/), because a
 * mail client will not load anything relative and we are not putting them on a
 * third party.
 *
 * Two details this template depends on, both verified against Plunk's source:
 *
 * - `{{unsubscribeUrl}}` is the variable Plunk actually resolves — its email
 *   processor formats every message with `unsubscribeUrl`, `subscribeUrl` and
 *   `manageUrl` in scope. The design arrived using `{{plunk_unsubscribe_url}}`,
 *   which resolves to nothing; that would have shipped a dead unsubscribe link
 *   *and* silently dropped the RFC 8058 headers, since Plunk only emits those
 *   when the rendered body links to `/unsubscribe/<contact>`.
 * - Plunk leaves HTML alone only when it looks hand-written — its
 *   `detectCustomHtmlPatterns` looks for non-prose classes or `data-`/`aria-`/
 *   `role=`/`id=` attributes. The `role="presentation"` tables here clear that
 *   bar. Strip them and Plunk would wrap this in its own prose styles instead.
 *
 * Keep it under ~100 KB rendered: Gmail clips messages past 102 KB.
 */

/** One sentence that varies by role, matched to the design's muted body style. */
const ROLE_LINES: Record<string, string> = {
  learner: 'You joined as a learner, so the first thing you will meet is the course library and the credentials that come out of it.',
  instructor: 'You joined as an instructor, so you will be among the people I ask about the authoring and review tools while they can still change.',
  parent: 'You joined as a parent or guardian, which means linking a guardian to a learner is something I will want tested early.',
}

const TEMPLATE = `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark light">
<meta name="supported-color-schemes" content="dark light">
<title>You're on the Alexandria waitlist for early access</title>
<!--[if mso]>
<noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript>
<![endif]-->
<style>
  body,table,td,a{-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
  table,td{mso-table-lspace:0pt;mso-table-rspace:0pt}
  img{-ms-interpolation-mode:bicubic;border:0;height:auto;line-height:100%;outline:none;text-decoration:none;display:block}
  table{border-collapse:collapse!important}
  body{margin:0!important;padding:0!important;width:100%!important}
  a{color:#A5B4FC}
  a[x-apple-data-detectors]{color:inherit!important;text-decoration:none!important;font-size:inherit!important;font-family:inherit!important;font-weight:inherit!important;line-height:inherit!important}
  @media screen and (max-width:600px){
    .wrap{width:100%!important}
    .px{padding-left:22px!important;padding-right:22px!important}
    .fluid{width:100%!important;height:auto!important}
    .btnrow td{display:block!important;width:100%!important;padding-bottom:10px!important}
  }
  @media (prefers-color-scheme:dark){
    .bg{background-color:#0C1024!important}
    .card{background-color:#141B33!important}
    .txt{color:#E8ECF5!important}
    .mut{color:#A9B6CC!important}
  }
</style>
</head>
<body class="bg" style="margin:0;padding:0;background-color:#0C1024;">

<div style="display:none;font-size:1px;color:#0C1024;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
  You're on the waitlist for early access. Here's what Alexandria is, what works today, and what honestly doesn't yet.
  &#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;&#8199;
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="bg" style="background-color:#0C1024;">
<tr><td align="center" style="padding:26px 12px 40px 12px;">

  <table role="presentation" class="wrap" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">

    <!-- HERO -->
    <tr><td bgcolor="#1B1E52" style="background-color:#1B1E52;line-height:0;font-size:0;">
      <a href="https://alexandria.ifftu.dev" style="text-decoration:none;">
        <img class="fluid" src="https://alexandria.ifftu.dev/email/email-hero.jpg" width="600" height="220" alt="Alexandria — You're on the list. Early access is coming."
             style="width:600px;max-width:600px;height:auto;display:block;">
      </a>
    </td></tr>

    <!-- INTRO -->
    <tr><td class="card px" bgcolor="#141B33" style="background-color:#141B33;padding:30px 40px 24px 40px;">
      <p class="txt" style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:17px;line-height:27px;color:#FFFFFF;font-weight:bold;">
        You're on the waitlist for early access.
      </p>
      <p class="mut" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:26px;color:#A9B6CC;">
        This is the waitlist, not access itself — we're letting people in a group at a time while the alpha settles. You'll hear from me when it's your turn, with what to do next. No drip sequence, no newsletter you didn't ask for. In the meantime, here's what you've put your name down for.
      </p>
          {{ROLE_LINE}}
    </td></tr>

    <!-- THESIS -->
    <tr><td class="card px" bgcolor="#141B33" style="background-color:#141B33;padding:0 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="3" bgcolor="#6366F1" style="background-color:#6366F1;width:3px;font-size:0;line-height:0;">&nbsp;</td>
          <td width="18" style="width:18px;font-size:0;line-height:0;">&nbsp;</td>
          <td>
            <p class="txt" style="margin:0;font-family:Georgia,'Times New Roman',serif;font-size:19px;line-height:30px;color:#E8ECF5;font-style:italic;">
              The internet made learning free.<br>It never made <span style="color:#A5B4FC;">recognition</span> free.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>

    <tr><td class="card px" bgcolor="#141B33" style="background-color:#141B33;padding:20px 40px 26px 40px;">
      <p class="mut" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:26px;color:#A9B6CC;">
        The credential — the thing that actually opens a door — still belongs to whoever charges for it, gatekeeps it, or hosts it. Alexandria is an attempt at the other half: proof you own, that travels with you, that anyone can check.
      </p>
    </td></tr>

    <!-- PRODUCT SHOT -->
    <tr><td bgcolor="#0C1024" style="background-color:#0C1024;line-height:0;font-size:0;">
      <img class="fluid" src="https://alexandria.ifftu.dev/email/email-app.jpg" width="600" height="290" alt="The Alexandria app running on macOS — courses, live tutoring, skills and credentials"
           style="width:600px;max-width:600px;height:auto;display:block;">
    </td></tr>
    <tr><td class="card px" bgcolor="#141B33" style="background-color:#141B33;padding:12px 40px 0 40px;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#93A3BC;">
        The alpha, running on macOS. The same app on Windows, Linux, iOS and Android.
      </p>
    </td></tr>

    <!-- WHAT IT IS -->
    <tr><td class="card px" bgcolor="#141B33" style="background-color:#141B33;padding:28px 40px 14px 40px;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;color:#A5B4FC;">WHAT IT IS</p>
    </td></tr>

    <tr><td class="card px" bgcolor="#141B33" style="background-color:#141B33;padding:0 40px 6px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="54" valign="top" style="width:54px;padding-bottom:20px;">
            <img src="https://alexandria.ifftu.dev/email/email-icon-free.png" width="40" height="40" alt="" style="width:40px;height:40px;display:block;">
          </td>
          <td valign="top" style="padding-bottom:20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:25px;color:#A9B6CC;">
            <span style="color:#FFFFFF;font-weight:bold;">Free and open source.</span><br>MIT-licensed core, native on all five major platforms.
          </td>
        </tr>
        <tr>
          <td width="54" valign="top" style="width:54px;padding-bottom:20px;">
            <img src="https://alexandria.ifftu.dev/email/email-icon-device.png" width="40" height="40" alt="" style="width:40px;height:40px;display:block;">
          </td>
          <td valign="top" style="padding-bottom:20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:25px;color:#A9B6CC;">
            <span style="color:#FFFFFF;font-weight:bold;">Runs on your device.</span><br>Peer-to-peer and offline-first. No subscriptions, no tracking, and no company server holding your work.
          </td>
        </tr>
        <tr>
          <td width="54" valign="top" style="width:54px;padding-bottom:20px;">
            <img src="https://alexandria.ifftu.dev/email/email-icon-own.png" width="40" height="40" alt="" style="width:40px;height:40px;display:block;">
          </td>
          <td valign="top" style="padding-bottom:20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:25px;color:#A9B6CC;">
            <span style="color:#FFFFFF;font-weight:bold;">Credentials you own.</span><br>Signed under a key only you hold, and verifiable by anyone — even if Alexandria disappears.
          </td>
        </tr>
        <tr>
          <td width="54" valign="top" style="width:54px;">
            <img src="https://alexandria.ifftu.dev/email/email-icon-lang.png" width="40" height="40" alt="" style="width:40px;height:40px;display:block;">
          </td>
          <td valign="top" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:25px;color:#A9B6CC;">
            <span style="color:#FFFFFF;font-weight:bold;">Nine languages.</span><br>Including Hindi, Bengali, Telugu, Marathi and Urdu.
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- PLATFORMS -->
    <tr><td class="card px" bgcolor="#141B33" align="center" style="background-color:#141B33;padding:26px 40px 8px 40px;">
      <img src="https://alexandria.ifftu.dev/email/email-platforms.png" width="380" height="44" alt="macOS, iOS, Windows, Linux, Android"
           style="width:380px;max-width:100%;height:auto;display:block;">
    </td></tr>
    <tr><td class="card px" bgcolor="#141B33" align="center" style="background-color:#141B33;padding:2px 40px 28px 40px;">
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:1px;color:#93A3BC;">ONE APP &middot; FIVE PLATFORMS &middot; NINE LANGUAGES</p>
    </td></tr>

    <!-- HONEST PART -->
    <tr><td class="card px" bgcolor="#141B33" style="background-color:#141B33;padding:0 40px 28px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#1B1B33" style="background-color:#1B1B33;">
        <tr>
          <td width="4" bgcolor="#FBBF24" style="background-color:#FBBF24;width:4px;font-size:0;line-height:0;">&nbsp;</td>
          <td style="padding:20px 22px;">
            <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;letter-spacing:2px;color:#FBBF24;">THE HONEST PART</p>
            <p class="mut" style="margin:0 0 12px 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;color:#A9B6CC;">
              It's an alpha. The interface needs real design work, there's no content moderation yet, and there are open security findings I'm working through in public. Nobody outside the project is using it yet.
            </p>
            <p class="mut" style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:24px;color:#A9B6CC;">
              I'd rather you heard that from me. If it makes you want to wait, that's completely fair — you'll still hear from me when it's ready.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- BUTTONS -->
    <tr><td class="card px" bgcolor="#141B33" style="background-color:#141B33;padding:0 40px 32px 40px;">
      <table role="presentation" class="btnrow" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td bgcolor="#6366F1" style="border-radius:26px;background-color:#6366F1;">
            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://www.ifftu.dev/blog/introducing-alexandria/" style="height:46px;v-text-anchor:middle;width:236px;" arcsize="56%" stroke="f" fillcolor="#6366F1"><w:anchorlock/><center style="color:#ffffff;font-family:Arial,sans-serif;font-size:15px;font-weight:bold;">Read the full story</center></v:roundrect><![endif]-->
            <!--[if !mso]><!-- -->
            <a href="https://www.ifftu.dev/blog/introducing-alexandria/" style="display:inline-block;padding:14px 28px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#FFFFFF;text-decoration:none;border-radius:26px;">Read the full story</a>
            <!--<![endif]-->
          </td>
          <td width="12" style="font-size:0;line-height:0;">&nbsp;</td>
          <td style="border-radius:26px;border:1px solid #3A4470;">
            <a href="https://alexandria.ifftu.dev" style="display:inline-block;padding:13px 26px;font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#A5B4FC;text-decoration:none;border-radius:26px;">Visit the site</a>
          </td>
        </tr>
      </table>
    </td></tr>

    <!-- SIGN-OFF -->
    <tr><td class="card px" bgcolor="#141B33" style="background-color:#141B33;padding:0 40px 32px 40px;">
      <div style="height:1px;background-color:#252E4D;line-height:1px;font-size:0;">&nbsp;</div>
      <p class="mut" style="margin:22px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:14px;line-height:25px;color:#A9B6CC;">
        If you work in education, assessment, hiring or distributed systems, I'd genuinely like to hear where you think I'm wrong. Just reply — it reaches me directly.
      </p>
      <p class="txt" style="margin:18px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:23px;color:#FFFFFF;font-weight:bold;">
        Pratyush Pundir
      </p>
      <p style="margin:2px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#93A3BC;">
        Founder, Alexandria &middot; IFFTU
      </p>
    </td></tr>

    <!-- FOOTER -->
    <tr><td style="height:22px;line-height:22px;font-size:0;">&nbsp;</td></tr>
    <tr><td class="px" align="center" style="padding:0 40px 14px 40px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
        <tr>
          <td style="padding:0 9px 0 0;" valign="middle">
            <img src="https://alexandria.ifftu.dev/email/email-mark-alexandria.png" width="22" height="22" alt="Alexandria" style="display:block;width:22px;height:22px;border:0;">
          </td>
          <td style="padding:0 18px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#93A3BC;letter-spacing:0.06em;" valign="middle">
            ALEXANDRIA
          </td>
          <td style="padding:0 8px 0 0;" valign="middle">
            <img src="https://alexandria.ifftu.dev/email/email-mark-ifftu.png" width="20" height="20" alt="IFFTU" style="display:block;width:20px;height:20px;border:0;">
          </td>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#93A3BC;letter-spacing:0.06em;" valign="middle">
            AN IFFTU PROJECT
          </td>
        </tr>
      </table>
    </td></tr>
    <tr><td class="px" align="center" style="padding:0 40px;">
      <p style="margin:0 0 10px 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#93A3BC;">
        <a href="https://alexandria.ifftu.dev" style="color:#93A3BC;text-decoration:underline;">alexandria.ifftu.dev</a>
        &nbsp;&middot;&nbsp;<a href="https://github.com/ifftu-dev/alexandria" style="color:#93A3BC;text-decoration:underline;">GitHub</a>
        &nbsp;&middot;&nbsp;<a href="https://www.ifftu.dev" style="color:#93A3BC;text-decoration:underline;">ifftu.dev</a>
      </p>
      <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:20px;color:#6E7A94;">
        You're receiving this because you joined the waitlist for early access to Alexandria.<br>
        <a href="{{unsubscribeUrl}}" style="color:#6E7A94;text-decoration:underline;">Unsubscribe</a>
      </p>
    </td></tr>

  </table>

</td></tr>
</table>
</body>
</html>`

/**
 * `role` is already validated against the allowlist by the caller, but the
 * fallback keeps a bad value from producing an email with a gap in it.
 */
export function confirmationHtml(role: string): string {
  const line = ROLE_LINES[role] ?? ROLE_LINES.learner
  return TEMPLATE.replace(
    '{{ROLE_LINE}}',
    `<p class="mut" style="margin:12px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:26px;color:#A9B6CC;">${line}</p>`,
  )
}
