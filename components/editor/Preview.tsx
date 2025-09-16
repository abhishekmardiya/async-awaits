import { Code } from "bright";
import { MDXRemote } from "next-mdx-remote/rsc";

Code.theme = {
  light: "github-light",
  dark: "github-dark",
  lightSelector: "html.light",
};

export const Preview = ({ content }: { content: string }) => {
  // replace all backslashes and ampersands with empty strings
  const formattedContent = content?.replace(/\\/g, "")?.replace(/&#x20;/g, "");

  return (
    // prose is to apply the prose styles (for the headings, paragraphs, lists, etc.)
    <section className="markdown prose grid break-words">
      <MDXRemote
        source={formattedContent}
        components={{
          // pre is the code block component
          pre: (props) => (
            <Code
              {...props}
              lineNumbers
              className="shadow-light-200 dark:shadow-dark-200"
            />
          ),
        }}
      />
    </section>
  );
};
