import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Info, Save, FileText, Eye, Upload } from "lucide-react";
import { useLanguage } from "../../lib/i18n";

interface PageContent {
  id: string;
  title: string;
  sections: {
    id: string;
    title: string;
    content: string;
  }[];
}

export default function ContentSettings() {
  const { t, language } = useLanguage();
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [pages, setPages] = useState<PageContent[]>([
    {
      id: "home",
      title: "Home Page",
      sections: [
        {
          id: "hero",
          title: "Hero Section",
          content:
            "# Welcome to BMI Tracker\n\nTrack your fitness journey with our professional tools and personalized recommendations.",
        },
        {
          id: "features",
          title: "Features Section",
          content:
            "## Key Features\n\n- Standard BMI Calculator\n- Sport-Specific BMI Calculator\n- Professional BMI Analysis\n- Health & Performance Recommendations",
        },
      ],
    },
    {
      id: "about",
      title: "About Page",
      sections: [
        {
          id: "mission",
          title: "Our Mission",
          content:
            "# Our Mission\n\nWe are dedicated to helping individuals achieve their fitness goals through accurate tracking and personalized recommendations.",
        },
        {
          id: "team",
          title: "Our Team",
          content:
            "## Our Team\n\nOur team consists of fitness professionals, nutritionists, and software engineers committed to providing the best tools for your fitness journey.",
        },
      ],
    },
    {
      id: "recommendations",
      title: "Recommendations Page",
      sections: [
        {
          id: "intro",
          title: "Introduction",
          content:
            "# Health & Performance Recommendations\n\nPersonalized recommendations based on your body composition, sport preferences, and fitness goals.",
        },
        {
          id: "help",
          title: "How to Use",
          content:
            "## How to Use These Recommendations\n\nThese personalized recommendations are based on your current metrics and sport focus. Save your favorites, implement them consistently, and track your progress over time for best results.",
        },
      ],
    },
  ]);

  // Load content when page or section changes
  useEffect(() => {
    if (selectedPage && selectedSection) {
      const page = pages.find((p) => p.id === selectedPage);
      if (page) {
        const section = page.sections.find((s) => s.id === selectedSection);
        if (section) {
          setContent(section.content);
          return;
        }
      }
    }
    setContent("");
  }, [selectedPage, selectedSection, pages]);

  // Handle content change
  const handleContentChange = (value: string) => {
    setContent(value);
  };

  // Save content changes
  const saveContent = async () => {
    setIsSaving(true);
    try {
      // Update local state
      const updatedPages = pages.map((page) => {
        if (page.id === selectedPage) {
          return {
            ...page,
            sections: page.sections.map((section) => {
              if (section.id === selectedSection) {
                return {
                  ...section,
                  content,
                };
              }
              return section;
            }),
          };
        }
        return page;
      });
      setPages(updatedPages);

      // Save to database via API
      const response = await fetch("/api/site-settings.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "content",
          settings: {
            pageId: selectedPage,
            sectionId: selectedSection,
            content,
            language,
          },
        }),
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message || "Failed to save content");
      }

      alert("Content saved successfully!");
    } catch (error) {
      console.error("Error saving content:", error);
      alert("Failed to save content. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Toggle preview mode
  const togglePreviewMode = () => {
    setIsPreviewMode(!isPreviewMode);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.content.title")}</CardTitle>
        <CardDescription>{t("settings.content.subtitle")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Page Selection */}
          <div className="space-y-2">
            <Label htmlFor="page-select">{t("settings.content.pages")}</Label>
            <Select
              value={selectedPage}
              onValueChange={(value) => {
                setSelectedPage(value);
                setSelectedSection(""); // Reset section when page changes
              }}
            >
              <SelectTrigger id="page-select">
                <SelectValue placeholder="Select a page" />
              </SelectTrigger>
              <SelectContent>
                {pages.map((page) => (
                  <SelectItem key={page.id} value={page.id}>
                    {page.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Section Selection */}
          <div className="space-y-2">
            <Label htmlFor="section-select">
              {t("settings.content.sections")}
            </Label>
            <Select
              value={selectedSection}
              onValueChange={setSelectedSection}
              disabled={!selectedPage}
            >
              <SelectTrigger id="section-select">
                <SelectValue placeholder="Select a section" />
              </SelectTrigger>
              <SelectContent>
                {selectedPage &&
                  pages
                    .find((p) => p.id === selectedPage)
                    ?.sections.map((section) => (
                      <SelectItem key={section.id} value={section.id}>
                        {section.title}
                      </SelectItem>
                    ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Content Editor */}
        {selectedPage && selectedSection ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="content-editor">
                {t("settings.content.editContent")}
              </Label>
              <Button variant="outline" size="sm" onClick={togglePreviewMode}>
                {isPreviewMode ? (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Edit
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-4 w-4" />
                    {t("settings.content.previewChanges")}
                  </>
                )}
              </Button>
            </div>

            {isPreviewMode ? (
              <div className="border rounded-md p-4 min-h-[300px] prose dark:prose-invert max-w-none">
                {/* This would use a markdown renderer in a real app */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: content
                      .replace(/\n/g, "<br>")
                      .replace(/^# (.+)$/gm, "<h1>$1</h1>")
                      .replace(/^## (.+)$/gm, "<h2>$1</h2>")
                      .replace(/^- (.+)$/gm, "<li>$1</li>"),
                  }}
                />
              </div>
            ) : (
              <Textarea
                id="content-editor"
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[300px] font-mono"
                placeholder="Enter content here..."
              />
            )}

            <div className="flex items-center p-4 bg-muted/50 rounded-lg">
              <Info className="h-5 w-5 mr-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Content supports Markdown formatting. Use # for headings, - for
                lists, etc.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border rounded-md bg-muted/20">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="mt-2 text-muted-foreground">
              Select a page and section to edit content.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={saveContent}
          disabled={
            isSaving || !selectedPage || !selectedSection || isPreviewMode
          }
        >
          <Save className="mr-2 h-4 w-4" />
          {isSaving
            ? t("common.loading")
            : t("settings.content.publishChanges")}
        </Button>
      </CardFooter>
    </Card>
  );
}
