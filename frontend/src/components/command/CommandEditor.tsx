"use client";

import {
  BlockNoteEditor,
  PartialBlock,
  filterSuggestionItems,
} from "@blocknote/core";
import {
  DefaultReactSuggestionItem,
  SuggestionMenuController,
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/mantine/style.css";
import {
  userInputItem,
  searchWebItem,
  scrapeURLItem,
  imageGenerationItem,
  textGenerationItem,
  summarizeItem,
} from "./CommandOptions";

import { schema } from "./customschema/Schema";
import { useEffect, useMemo, useState } from "react";
import { useEditor } from "../context/editorcontext";
import { FileEntry } from "../file-explorer/FileExplorer";
import { readFile } from "../services/api";

// List containing all default Slash Menu Items, as well as our custom one.
const getCustomSlashMenuItems = (
  editor: BlockNoteEditor
): DefaultReactSuggestionItem[] => [
  userInputItem(editor),
  // searchWebItem(editor),
  // scrapeURLItem(editor),
  // @ts-ignore
  imageGenerationItem(editor),
  // @ts-ignore
  textGenerationItem(editor),
  // ...getDefaultReactSlashMenuItems(editor),
  // @ts-ignore
  summarizeItem(editor),
];

const Editor = ({ selectedFile }: { selectedFile: FileEntry | null }) => {
  // Creates a new editor instance.
  const [initialContent, setInitialContent] = useState<PartialBlock[] | null>(
    null
  );

  const editor = useCreateBlockNote({
    schema,
  });

  const [title, setTitle] = useState(""); // State for the title

  const editorRef = useEditor();
  editorRef.current = editor;

  const read = async () => {
    if (selectedFile) {
      const res = await readFile(selectedFile.path);
      console.log("file details", res);
    }
  };

  useEffect(() => {
    read();
  }, [selectedFile]);

  return (
    <div className="flex flex-1 items-center px-4 py-6 w-full">
      <div className="w-full max-w-4xl min-h-[500px] border border-gray-300 rounded-lg shadow-md p-6 bg-white relative">
        {/* Card Title (Notion-style) */}
        <input
          type="text"
          placeholder="Untitled"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-3xl font-bold focus:outline-none w-full placeholder-gray-400 mb-4"
        />
        <div className="h-[450px] overflow-y-auto">
          {editor ? (
            <BlockNoteView editor={editor} slashMenu={false} theme={"light"}>
              <SuggestionMenuController
                triggerCharacter={"/"}
                getItems={async (query) =>
                  filterSuggestionItems(
                    //@ts-ignore
                    [...getCustomSlashMenuItems(editor)],
                    query
                  )
                }
              />
            </BlockNoteView>
          ) : (
            "Loading"
          )}
        </div>
      </div>
    </div>
  );
};

export default Editor;
