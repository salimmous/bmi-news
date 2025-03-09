import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { useLanguage } from "../../lib/i18n";
import {
  Globe,
  Search,
  Save,
  Upload,
  Download,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";
// Import translation service functions
import { getLanguageName } from "../../lib/translation-service";

export default function TranslationManagement() {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState("files");
  const [selectedLanguage, setSelectedLanguage] = useState<"en" | "fr" | "ar">(
    "en",
  );
  const [targetLanguage, setTargetLanguage] = useState<"en" | "fr" | "ar">(
    "en",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [translations, setTranslations] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [selectedKey, setSelectedKey] = useState("");
  const [editValue, setEditValue] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddKeyDialogOpen, setIsAddKeyDialogOpen] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [flattenedTranslations, setFlattenedTranslations] = useState<
    Array<{ key: string; value: string }>
  >([]);

  // Test translation functionality
  const [testSourceText, setTestSourceText] = useState("");
  const [testResultText, setTestResultText] = useState("");
  const [isTestTranslating, setIsTestTranslating] = useState(false);

  // Handle test translation
  const handleTestTranslation = async () => {
    if (!testSourceText.trim()) return;

    setIsTestTranslating(true);
    try {
      // Import the translation service dynamically
      const { translateText } = await import("../../lib/translation-service");

      // Translate the test text
      const result = await translateText(
        testSourceText,
        selectedLanguage,
        targetLanguage,
      );
      setTestResultText(result);
    } catch (error) {
      console.error("Test translation error:", error);
      setTestResultText(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      setIsTestTranslating(false);
    }
  };

  // Load translations
  useEffect(() => {
    const loadTranslations = async () => {
      setLoading(true);
      try {
        // In a real app, this would fetch from an API
        const response = await fetch(`/locales/${selectedLanguage}.json`);
        const data = await response.json();
        setTranslations(data);

        // Flatten the nested structure for display in the table
        const flattened = flattenObject(data);
        setFlattenedTranslations(
          Object.entries(flattened).map(([key, value]) => ({
            key,
            value: value as string,
          })),
        );
      } catch (error) {
        console.error(`Error loading ${selectedLanguage} translations:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [selectedLanguage]);

  // Filter translations based on search term
  const filteredTranslations = flattenedTranslations.filter(
    (item) =>
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.value.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Flatten nested object structure
  const flattenObject = (obj: Record<string, any>, prefix = "") => {
    return Object.keys(obj).reduce((acc: Record<string, any>, k) => {
      const pre = prefix.length ? `${prefix}.` : "";
      if (
        typeof obj[k] === "object" &&
        obj[k] !== null &&
        !Array.isArray(obj[k])
      ) {
        Object.assign(acc, flattenObject(obj[k], pre + k));
      } else {
        acc[pre + k] = obj[k];
      }
      return acc;
    }, {});
  };

  // Unflatten object for saving
  const unflattenObject = (obj: Record<string, any>) => {
    const result: Record<string, any> = {};

    for (const key in obj) {
      const keys = key.split(".");
      let current = result;

      for (let i = 0; i < keys.length; i++) {
        const k = keys[i];
        if (i === keys.length - 1) {
          current[k] = obj[key];
        } else {
          current[k] = current[k] || {};
          current = current[k];
        }
      }
    }

    return result;
  };

  // Save translations
  const saveTranslations = async () => {
    setSaving(true);
    try {
      // Convert flattened translations back to nested structure
      const flatObj = flattenedTranslations.reduce(
        (acc, { key, value }) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, string>,
      );

      const nestedObj = unflattenObject(flatObj);

      // In a real app, this would save to an API
      // For demo purposes, we'll just log it
      console.log(`Saving ${selectedLanguage} translations:`, nestedObj);

      alert(`Translations for ${selectedLanguage} saved successfully!`);
    } catch (error) {
      console.error(`Error saving ${selectedLanguage} translations:`, error);
      alert(
        `Failed to save translations for ${selectedLanguage}. Please try again.`,
      );
    } finally {
      setSaving(false);
    }
  };

  // Handle edit translation
  const handleEditTranslation = (key: string, value: string) => {
    setSelectedKey(key);
    setEditValue(value);
    setIsEditDialogOpen(true);
  };

  // Save edited translation
  const saveEditedTranslation = () => {
    setFlattenedTranslations((prev) =>
      prev.map((item) =>
        item.key === selectedKey ? { ...item, value: editValue } : item,
      ),
    );
    setIsEditDialogOpen(false);
  };

  // Add new translation key
  const addNewTranslationKey = () => {
    if (!newKey || !newValue) return;

    // Check if key already exists
    if (flattenedTranslations.some((item) => item.key === newKey)) {
      alert(`Key '${newKey}' already exists. Please use a different key.`);
      return;
    }

    setFlattenedTranslations((prev) => [
      ...prev,
      { key: newKey, value: newValue },
    ]);

    setNewKey("");
    setNewValue("");
    setIsAddKeyDialogOpen(false);
  };

  // Delete translation key
  const deleteTranslationKey = (key: string) => {
    if (confirm(`Are you sure you want to delete the key '${key}'?`)) {
      setFlattenedTranslations((prev) =>
        prev.filter((item) => item.key !== key),
      );
    }
  };

  // Auto-translate using AI
  const autoTranslate = async () => {
    if (selectedLanguage === targetLanguage) {
      alert("Source and target languages cannot be the same.");
      return;
    }

    setTranslating(true);
    try {
      // Get target language translations for comparison
      const targetResponse = await fetch(`/locales/${targetLanguage}.json`);
      const targetData = await targetResponse.json();
      const targetFlattened = flattenObject(targetData);

      // Create a copy of the current flattened translations
      const updatedTranslations = [...flattenedTranslations];

      // Find keys that need translation (missing in target language)
      const keysToTranslate = updatedTranslations
        .filter((item) => !targetFlattened[item.key])
        .slice(0, 10); // Limit to 10 items for demo purposes

      if (keysToTranslate.length === 0) {
        alert(
          "No missing translations found. All keys already exist in the target language.",
        );
        return;
      }

      // Translate each item
      for (const item of keysToTranslate) {
        try {
          // Import the translation service dynamically to avoid circular dependencies
          const { translateText } = await import(
            "../../lib/translation-service"
          );

          // Use AI to translate
          const translatedText = await translateText(
            item.value,
            selectedLanguage,
            targetLanguage,
          );

          // Find the item in the updated translations and update it
          const index = updatedTranslations.findIndex(
            (t) => t.key === item.key,
          );
          if (index !== -1) {
            updatedTranslations[index] = {
              ...updatedTranslations[index],
              value: translatedText,
            };
          }
        } catch (error) {
          console.error(`Error translating key ${item.key}:`, error);
        }
      }

      // Update the state with translated values
      setFlattenedTranslations(updatedTranslations);

      alert(
        `Auto-translation from ${getLanguageName(selectedLanguage)} to ${getLanguageName(targetLanguage)} completed for ${keysToTranslate.length} items.`,
      );
    } catch (error) {
      console.error("Error during auto-translation:", error);
      alert("Failed to complete auto-translation. Please try again.");
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Translation Management</h1>
      </div>

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-2 w-[400px]">
          <TabsTrigger value="files" className="flex items-center">
            <Globe className="mr-2 h-4 w-4" />
            Language Files
          </TabsTrigger>
          <TabsTrigger value="auto" className="flex items-center">
            <RefreshCw className="mr-2 h-4 w-4" />
            Auto Translation
          </TabsTrigger>
        </TabsList>

        {/* Language Files Tab */}
        <TabsContent value="files" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manage Translation Files</CardTitle>
              <CardDescription>
                Edit and manage translation files for different languages
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div>
                  <Label htmlFor="language-select">Select Language</Label>
                  <Select
                    value={selectedLanguage}
                    onValueChange={(value) =>
                      setSelectedLanguage(value as "en" | "fr" | "ar")
                    }
                  >
                    <SelectTrigger id="language-select" className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">French (Français)</SelectItem>
                      <SelectItem value="ar">Arabic (العربية)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-1">
                  <Label htmlFor="search-translations">
                    Search Translations
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="search-translations"
                      placeholder="Search by key or value..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsAddKeyDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Key
                  </Button>
                  <Button onClick={saveTranslations} disabled={saving}>
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-8">
                  <p>Loading translations...</p>
                </div>
              ) : (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-1/3">Key</TableHead>
                        <TableHead className="w-1/2">Value</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTranslations.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={3}
                            className="text-center py-8 text-muted-foreground"
                          >
                            No translations found matching your search
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTranslations.map((item) => (
                          <TableRow key={item.key}>
                            <TableCell className="font-mono text-sm">
                              {item.key}
                            </TableCell>
                            <TableCell>
                              <div
                                className={
                                  selectedLanguage === "ar"
                                    ? "font-['Tajawal'] text-right"
                                    : ""
                                }
                              >
                                {item.value}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  onClick={() =>
                                    handleEditTranslation(item.key, item.value)
                                  }
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-100"
                                  onClick={() => deleteTranslationKey(item.key)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {filteredTranslations.length} of{" "}
                {flattenedTranslations.length} translation keys
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Auto Translation Tab */}
        <TabsContent value="auto" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Powered Translation</CardTitle>
              <CardDescription>
                Automatically translate content between languages using AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="source-language">Source Language</Label>
                    <Select
                      value={selectedLanguage}
                      onValueChange={(value) =>
                        setSelectedLanguage(value as "en" | "fr" | "ar")
                      }
                    >
                      <SelectTrigger id="source-language">
                        <SelectValue placeholder="Select source language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French (Français)</SelectItem>
                        <SelectItem value="ar">Arabic (العربية)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="target-language">Target Language</Label>
                    <Select
                      value={targetLanguage}
                      onValueChange={(value) =>
                        setTargetLanguage(value as "en" | "fr" | "ar")
                      }
                    >
                      <SelectTrigger id="target-language">
                        <SelectValue placeholder="Select target language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="fr">French (Français)</SelectItem>
                        <SelectItem value="ar">Arabic (العربية)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={autoTranslate}
                      disabled={
                        translating || selectedLanguage === targetLanguage
                      }
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {translating
                        ? "Translating..."
                        : "Auto-Translate Missing Keys"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-4 border-l pl-6">
                  <h3 className="text-lg font-medium">Translation Testing</h3>
                  <div>
                    <Label htmlFor="test-source">Source Text</Label>
                    <Textarea
                      id="test-source"
                      placeholder={`Enter text in ${getLanguageName(selectedLanguage)}...`}
                      className={
                        selectedLanguage === "ar"
                          ? "font-['Tajawal'] text-right"
                          : ""
                      }
                      value={testSourceText}
                      onChange={(e) => setTestSourceText(e.target.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleTestTranslation}
                    disabled={
                      isTestTranslating ||
                      !testSourceText.trim() ||
                      selectedLanguage === targetLanguage
                    }
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {isTestTranslating ? "Translating..." : "Translate"}
                  </Button>
                  <div>
                    <Label htmlFor="test-result">Translation Result</Label>
                    <Textarea
                      id="test-result"
                      placeholder={`Translation in ${getLanguageName(targetLanguage)}...`}
                      readOnly
                      value={testResultText}
                      className={
                        targetLanguage === "ar"
                          ? "font-['Tajawal'] text-right"
                          : ""
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="text-sm text-muted-foreground">
                <p>
                  AI translation is powered by machine learning models and may
                  not be 100% accurate. Always review translations before
                  publishing.
                </p>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Translation Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Translation</DialogTitle>
            <DialogDescription>
              Edit the translation value for this key
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="edit-key" className="text-muted-foreground">
                Key
              </Label>
              <Input
                id="edit-key"
                value={selectedKey}
                readOnly
                className="bg-muted"
              />
            </div>
            <div>
              <Label htmlFor="edit-value">Value</Label>
              <Textarea
                id="edit-value"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                className={
                  selectedLanguage === "ar" ? "font-['Tajawal'] text-right" : ""
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={saveEditedTranslation}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add New Key Dialog */}
      <Dialog open={isAddKeyDialogOpen} onOpenChange={setIsAddKeyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Translation Key</DialogTitle>
            <DialogDescription>
              Add a new key and value to the translation file
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="new-key">Key (dot notation for nesting)</Label>
              <Input
                id="new-key"
                placeholder="e.g., common.buttons.save"
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="new-value">Value</Label>
              <Textarea
                id="new-value"
                placeholder="Translation value"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className={
                  selectedLanguage === "ar" ? "font-['Tajawal'] text-right" : ""
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddKeyDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={addNewTranslationKey}
              disabled={!newKey || !newValue}
            >
              Add Key
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
