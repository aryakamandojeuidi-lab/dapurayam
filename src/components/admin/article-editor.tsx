"use client";

import { MDXEditor, type MDXEditorMethods } from "@mdxeditor/editor";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  linkPlugin,
  linkDialogPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  imagePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  InsertThematicBreak,
  BoldItalicUnderlineToggles,
  ListsToggle,
  BlockTypeSelect,
  UndoRedo,
  CreateLink,
  InsertImage,
  InsertTable,
} from "@mdxeditor/editor";
import { useRef } from "react";
import "@mdxeditor/editor/style.css";

type Props = {
  value: string;
  onChange: (markdown: string) => void;
};

export function ArticleEditor({ value, onChange }: Props) {
  const editorRef = useRef<MDXEditorMethods>(null);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-background">
      <MDXEditor
        ref={editorRef}
        markdown={value}
        onChange={onChange}
        className="min-h-[400px]"
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          quotePlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          thematicBreakPlugin(),
          imagePlugin({
            imageUploadHandler: async (image) => {
              const formData = new FormData();
              formData.append("file", image);
              const res = await fetch("/api/upload", {
                method: "POST",
                body: formData,
              });
              const data = await res.json();
              if (!res.ok) {
                throw new Error(data.error || "Gagal mengunggah gambar");
              }
              return data.url;
            },
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <>
                <UndoRedo />
                <BlockTypeSelect />
                <BoldItalicUnderlineToggles />
                <ListsToggle />
                <CreateLink />
                <InsertImage />
                <InsertTable />
                <InsertThematicBreak />
              </>
            ),
          }),
        ]}
      />
    </div>
  );
}
