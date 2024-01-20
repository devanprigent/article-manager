import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faCube } from "@fortawesome/free-solid-svg-icons";
import {
    faFacebook,
    faLinkedin,
    faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const socials = [
    {
        icon: faFacebook,
        url: "https://www.facebook.com/",
    },
    {
        icon: faFacebook,
        url: "https://www.messenger.com/",
    },
    {
        icon: faInstagram,
        url: "https://www.instagram.com/",
    },
    {
        icon: faLinkedin,
        url: "https://www.linkedin.com",
    },
    {
        icon: faEnvelope,
        url: "https://mail.google.com/mail/u/0/#inbox",
    },
    {
        icon: faEnvelope,
        url: "https://z.imt.fr/zimbra/#1",
    },
    {
        icon: faCube,
        url: "https://www.notion.so/",
    },
];

function Accounts() {
    return (
        <div className="d-flex justify-content-center align-items-center vh-100">
            {socials.map((social) => (
                <a key={social.url} href={social.url} className="mx-5">
                    <FontAwesomeIcon target="_blank" icon={social.icon} size="5x" style={{ margin: '0.5rem' }} />
                </a>
            ))}
        </div>
    );
}

export default Accounts;
