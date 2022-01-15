import { ParseResult } from "./parse";
import { mdImg, mdLink } from "markdown-function";

export const toMarkdown = (parseResult: ParseResult): string => {
    const { title, url, coverImageUrl, annotations } = parseResult;
    const annotationsBody = annotations
        .map((annotation) => {
            const note = annotation.note ? `\n\n${annotation.note}` : "";
            return `> ${annotation.highlight.split("\n").join("\n> ")}
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
