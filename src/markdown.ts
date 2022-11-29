import { ParseResult } from "./parse";
import { mdImg, mdLink } from "markdown-function";

export type ToMarkdownOptions = {
    defaultHighlightMessage?: string;
};
export const toMarkdown = (parseResult: ParseResult, options?: ToMarkdownOptions): string => {
    const { title, url, coverImageUrl, annotations } = parseResult;
    const defaultHighlightMessage = options?.defaultHighlightMessage ?? "**CAN NOT SHOW THE HIGHLIGHT**";
    const annotationsBody = annotations
        .map((annotation) => {
            const note = annotation.note ? `\n\n${annotation.note}` : "";
            // Some highlight is empty string because can not get the highlight.
            return `> ${
                annotation.highlight === "" ? defaultHighlightMessage : annotation.highlight.split("\n").join("\n> ")
            }  
> Location: ${mdLink({
                url: annotation.kindleUrl,
                title: String(annotation.locationNumber),
                text: String(annotation.locationNumber)
            })}${note}`;
        })
        .join("\n\n");
    return `# ${mdLink({ url, title, text: title })}

${mdImg({ url: coverImageUrl, alt: "cover image" })}

${annotationsBody}
`;
};
