"use client";

import { useState } from "react";
import * as Tabs from "@radix-ui/react-tabs";
import { copyToClipboard } from "@/utils/copy-to-clipboard";
import { downloadFile } from "@/utils/download-file";
import { tabContent, type TabValue } from "./tab-content";
import Button from "@/components/ds/Button";
import type { ExportedColors } from "@/utils/code/generate-export";
import classes from "./component.module.css";

type PropTypes = {
  colors: ExportedColors;
};

export default function ExportPanel({ colors }: PropTypes) {
  const [value, setValue] = useState<TabValue>("figma");
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);

  const activeExport = colors.filter((c) => c.format === value)[0];

  return (
    <Tabs.Root
      className={classes.root}
      value={value}
      onValueChange={(newValue) => setValue(newValue as TabValue)}
      defaultValue={value}
      orientation="vertical"
    >
      <Tabs.List className={classes.tabs}>
        <div className={classes.sticky}>
          {tabContent.map((tab) => (
            <Tabs.Trigger
              key={tab.value}
              className={classes.tab}
              value={tab.value}
              disabled={tab.disabled}
            >
              {tab.label}
            </Tabs.Trigger>
          ))}
        </div>
      </Tabs.List>
      <div className={classes.panels}>
        {tabContent.map((tab) => (
          <Tabs.Content key={tab.value} value={tab.value} asChild>
            <div className={`${classes.panel} ${classes[tab.value]}`}>
              <div dangerouslySetInnerHTML={{ __html: activeExport.htmlString }} />
            </div>
          </Tabs.Content>
        ))}
        <div className={classes.export}>
          <Button
            onClick={() => {
              copyToClipboard(activeExport.copyString);
              setIsCopied(true);
              setTimeout(() => setIsCopied(false), 1500);
            }}
            isActive={isCopied}
          >
            {isCopied ? "Copied!" : `Copy ${activeExport.language.toLocaleUpperCase()}`}
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              downloadFile(activeExport.copyString, activeExport.language);
              setIsDownloaded(true);
              setTimeout(() => setIsDownloaded(false), 1500);
            }}
            isActive={isDownloaded}
          >
            {isDownloaded ? "Saved!" : `Download ${activeExport.language.toLocaleUpperCase()}`}
          </Button>
        </div>
      </div>
    </Tabs.Root>
  );
}
