import { replace } from "lodash";

export default (text: string) => {
    const urlRegex = /https?:\/\/[^\s/$.?#].[^\s]*/gm;

    const wrappedText = replace(text, urlRegex, '');

    return wrappedText;
}