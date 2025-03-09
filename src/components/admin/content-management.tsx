import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  FileText,
  Home,
  Info,
  Settings,
  Save,
  Eye,
  Plus,
  Trash2,
  Edit,
  Globe,
} from "lucide-react";
import { useLanguage } from "../../lib/i18n";

interface PageContent {
  id: string;
  title: string;
  slug: string;
  sections: {
    id: string;
    title: string;
    content: string;
  }[];
}

export default function ContentManagement() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("pages");
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [selectedSection, setSelectedSection] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [pages, setPages] = useState<PageContent[]>([
    {
      id: "home",
      title: "Home Page",
      slug: "/",
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
      slug: "/about",
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
      slug: "/recommendations",
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
  const loadContent = () => {
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
  };

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

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

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

  // Add new page
  const addNewPage = () => {
    const newPageId = `page-${pages.length + 1}`;
    const newPage: PageContent = {
      id: newPageId,
      title: `New Page ${pages.length + 1}`,
      slug: `/page-${pages.length + 1}`,
      sections: [
        {
          id: `${newPageId}-section-1`,
          title: "Main Content",
          content: "# New Page\n\nAdd your content here.",
        },
      ],
    };
    setPages([...pages, newPage]);
    setSelectedPage(newPageId);
    setSelectedSection(`${newPageId}-section-1`);
    setContent("# New Page\n\nAdd your content here.");
  };

  // Add new section to current page
  const addNewSection = () => {
    if (!selectedPage) return;

    const updatedPages = pages.map((page) => {
      if (page.id === selectedPage) {
        const newSectionId = `${page.id}-section-${page.sections.length + 1}`;
        return {
          ...page,
          sections: [
            ...page.sections,
            {
              id: newSectionId,
              title: `New Section ${page.sections.length + 1}`,
              content: "## New Section\n\nAdd your content here.",
            },
          ],
        };
      }
      return page;
    });

    setPages(updatedPages);
    const newPage = updatedPages.find((p) => p.id === selectedPage);
    if (newPage) {
      const newSectionId = newPage.sections[newPage.sections.length - 1].id;
      setSelectedSection(newSectionId);
      setContent("## New Section\n\nAdd your content here.");
    }
  };

  // Delete current section
  const deleteSection = () => {
    if (!selectedPage || !selectedSection) return;

    if (confirm("Are you sure you want to delete this section?")) {
      const updatedPages = pages.map((page) => {
        if (page.id === selectedPage) {
          // Don't allow deleting the last section
          if (page.sections.length <= 1) {
            alert("Cannot delete the last section of a page.");
            return page;
          }

          return {
            ...page,
            sections: page.sections.filter((s) => s.id !== selectedSection),
          };
        }
        return page;
      });

      setPages(updatedPages);
      setSelectedSection("");
      setContent("");
    }
  };

  // Delete current page
  const deletePage = () => {
    if (!selectedPage) return;

    if (confirm("Are you sure you want to delete this page?")) {
      setPages(pages.filter((p) => p.id !== selectedPage));
      setSelectedPage("");
      setSelectedSection("");
      setContent("");
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Content Management</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList>
          <TabsTrigger value="pages" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Pages
          </TabsTrigger>
          <TabsTrigger value="navigation" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Navigation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pages">
          <Card>
            <CardHeader>
              <CardTitle>Page Editor</CardTitle>
              <CardDescription>
                Edit content for different pages of your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Sidebar */}
                <div className="w-full md:w-64 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Pages</h3>
                      <Button variant="outline" size="sm" onClick={addNewPage}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="border rounded-md">
                      <div className="divide-y">
                        {pages.map((page) => (
                          <div
                            key={page.id}
                            className={`p-2 cursor-pointer hover:bg-muted ${selectedPage === page.id ? "bg-muted" : ""}`}
                            onClick={() => {
                              setSelectedPage(page.id);
                              if (page.sections.length > 0) {
                                setSelectedSection(page.sections[0].id);
                                setContent(page.sections[0].content);
                              }
                            }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                {page.id === "home" ? (
                                  <Home className="h-4 w-4 mr-2 text-primary" />
                                ) : page.id === "about" ? (
                                  <Info className="h-4 w-4 mr-2 text-primary" />
                                ) : (
                                  <FileText className="h-4 w-4 mr-2 text-primary" />
                                )}
                                <span>{page.title}</span>
                              </div>
                              {selectedPage === page.id && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deletePage();
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedPage && (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-medium">Sections</h3>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addNewSection}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="border rounded-md">
                        <div className="divide-y">
                          {pages
                            .find((p) => p.id === selectedPage)
                            ?.sections.map((section) => (
                              <div
                                key={section.id}
                                className={`p-2 cursor-pointer hover:bg-muted ${selectedSection === section.id ? "bg-muted" : ""}`}
                                onClick={() => {
                                  setSelectedSection(section.id);
                                  setContent(section.content);
                                }}
                              >
                                <div className="flex items-center justify-between">
                                  <span>{section.title}</span>
                                  {selectedSection === section.id && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-6 w-6 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteSection();
                                      }}
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </Button>
                                  )}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Language</h3>
                    <Select value={language}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            English
                          </div>
                        </SelectItem>
                        <SelectItem value="fr">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            Français
                          </div>
                        </SelectItem>
                        <SelectItem value="ar">
                          <div className="flex items-center">
                            <Globe className="mr-2 h-4 w-4" />
                            العربية
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Edit content for different languages
                    </p>
                  </div>
                </div>

                {/* Content Editor */}
                <div className="flex-1">
                  {selectedPage && selectedSection ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium">
                          {pages.find((p) => p.id === selectedPage)?.title} -{" "}
                          {
                            pages
                              .find((p) => p.id === selectedPage)
                              ?.sections.find((s) => s.id === selectedSection)
                              ?.title
                          }
                        </h3>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={togglePreviewMode}
                          >
                            {isPreviewMode ? (
                              <>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Preview
                              </>
                            )}
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={saveContent}
                            disabled={isSaving || isPreviewMode}
                          >
                            <Save className="mr-2 h-4 w-4" />
                            {isSaving ? "Saving..." : "Save"}
                          </Button>
                        </div>
                      </div>

                      {isPreviewMode ? (
                        <div className="border rounded-md p-4 min-h-[500px] prose dark:prose-invert max-w-none">
                          {/* This would use a markdown renderer in a real app */}
                          <div
                            dangerouslySetInnerHTML={{
                              __html: content
                                .replace(/\n/g, "<br>")
                                .replace(/^# (.+)$/gm, "<h1>$1</h1>")
                                .replace(/^## (.+)$/gm, "<h2>$1</h2>")
                                .replace(/^### (.+)$/gm, "<h3>$1</h3>")
                                .replace(/^- (.+)$/gm, "<li>$1</li>"),
                            }}
                          />
                        </div>
                      ) : (
                        <Textarea
                          value={content}
                          onChange={(e) => handleContentChange(e.target.value)}
                          className="min-h-[500px] font-mono"
                          placeholder="Enter content here..."
                        />
                      )}

                      <div className="flex items-center p-4 bg-muted/50 rounded-lg">
                        <Info className="h-5 w-5 mr-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          Content supports Markdown formatting. Use # for
                          headings, - for lists, etc.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-[500px] border rounded-md bg-muted/20">
                      <div className="text-center">
                        <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="mt-2 text-muted-foreground">
                          Select a page and section to edit content
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="navigation">
          <Card>
            <CardHeader>
              <CardTitle>Navigation Settings</CardTitle>
              <CardDescription>
                Configure the navigation menu and site structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Main Navigation</h3>
                  <p className="text-sm text-muted-foreground">
                    Drag and drop items to reorder them in the navigation menu
                  </p>
                  <div className="border rounded-md p-4">
                    <div className="space-y-2">
                      {pages.map((page, index) => (
                        <div
                          key={page.id}
                          className="flex items-center justify-between p-2 border rounded-md bg-muted/20"
                        >
                          <div className="flex items-center">
                            <span className="w-6 text-center text-muted-foreground">
                              {index + 1}
                            </span>
                            <span className="ml-2">{page.title}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Input
                              value={page.slug}
                              className="w-32"
                              onChange={(e) => {
                                const updatedPages = [...pages];
                                updatedPages[index].slug = e.target.value;
                                setPages(updatedPages);
                              }}
                            />
                            <Label className="text-sm text-muted-foreground">
                              URL Path
                            </Label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button>
                    <Save className="mr-2 h-4 w-4" />
                    Save Navigation
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
