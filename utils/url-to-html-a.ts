import { replace } from "lodash";

export default (text: string) => {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gm;

    const wrappedText = replace(text, urlRegex, (matchedUrl) => {
        return `<a class="blog-link" href="${matchedUrl}" target="_blank">${matchedUrl}</a>`;
    });

    return wrappedText;
}