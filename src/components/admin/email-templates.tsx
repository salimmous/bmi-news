import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
import { Mail, Plus, Trash2, Edit, Eye } from "lucide-react";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  type: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export function EmailTemplates() {
  const [templates, setTemplates] = useState<EmailTemplate[]>([
    {
      id: "1",
      name: "Welcome Email",
      subject: "Welcome to BMI Tracker!",
      type: "onboarding",
      content: `<h1>Welcome to BMI Tracker!</h1>
<p>Dear {{user.name}},</p>
<p>Thank you for joining BMI Tracker. We're excited to help you on your health journey!</p>
<p>With our platform, you can:</p>
<ul>
  <li>Track your BMI and weight over time</li>
  <li>Get personalized health recommendations</li>
  <li>Access professional meal and workout plans</li>
</ul>
<p>Get started by logging in and calculating your first BMI measurement.</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
      createdAt: "2023-06-01",
      updatedAt: "2023-06-01",
    },
    {
      id: "2",
      name: "Weekly Progress Report",
      subject: "Your Weekly BMI Progress Report",
      type: "report",
      content: `<h1>Your Weekly Progress Report</h1>
<p>Dear {{user.name}},</p>
<p>Here's a summary of your progress this week:</p>
<ul>
  <li>Current BMI: {{user.currentBMI}}</li>
  <li>BMI Change: {{user.bmiChange}}</li>
  <li>Current Weight: {{user.currentWeight}} kg</li>
  <li>Weight Change: {{user.weightChange}} kg</li>
</ul>
<p>{{#if user.isImproving}}
  Great job! You're making progress toward your goal.
{{else}}
  Keep going! Consistency is key to reaching your health goals.
{{/if}}</p>
<p>Log in to view your detailed progress charts and updated recommendations.</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
      createdAt: "2023-06-15",
      updatedAt: "2023-07-01",
    },
    {
      id: "3",
      name: "New Meal Plan Recommendation",
      subject: "Your Personalized Meal Plan is Ready",
      type: "recommendation",
      content: `<h1>Your Personalized Meal Plan</h1>
<p>Dear {{user.name}},</p>
<p>Based on your recent BMI measurements and goals, we've created a personalized meal plan for you.</p>
<h2>Your {{mealPlan.name}}</h2>
<p><strong>Daily Calorie Target:</strong> {{mealPlan.calories}} kcal</p>
<h3>Breakfast</h3>
<p>{{mealPlan.breakfast}}</p>
<h3>Lunch</h3>
<p>{{mealPlan.lunch}}</p>
<h3>Dinner</h3>
<p>{{mealPlan.dinner}}</p>
<h3>Snacks</h3>
<p>{{mealPlan.snacks}}</p>
<p>Log in to view your complete meal plan with nutritional information.</p>
<p>Best regards,<br>The BMI Tracker Team</p>`,
      createdAt: "2023-07-10",
      updatedAt: "2023-07-10",
    },
  ]);

  const [isAddingTemplate, setIsAddingTemplate] = useState(false);
  const [isEditingTemplate, setIsEditingTemplate] = useState(false);
  const [isViewingTemplate, setIsViewingTemplate] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(
    null,
  );

  const handleAddTemplate = () => {
    if (!currentTemplate) return;

    const newTemplate = {
      ...currentTemplate,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    };

    setTemplates([...templates, newTemplate]);
    setIsAddingTemplate(false);
    setCurrentTemplate(null);
  };

  const handleEditTemplate = () => {
    if (!currentTemplate) return;

    const updatedTemplate = {
      ...currentTemplate,
      updatedAt: new Date().toISOString().split("T")[0],
    };

    const updatedTemplates = templates.map((template) =>
      template.id === currentTemplate.id ? updatedTemplate : template,
    );

    setTemplates(updatedTemplates);
    setIsEditingTemplate(false);
    setCurrentTemplate(null);
  };

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((template) => template.id !== id));
  };

  const initNewTemplate = () => {
    setCurrentTemplate({
      id: "",
      name: "",
      subject: "",
      type: "general",
      content: "",
      createdAt: "",
      updatedAt: "",
    });
    setIsAddingTemplate(true);
  };

  const initEditTemplate = (template: EmailTemplate) => {
    setCurrentTemplate({ ...template });
    setIsEditingTemplate(true);
  };

  const viewTemplate = (template: EmailTemplate) => {
    setCurrentTemplate({ ...template });
    setIsViewingTemplate(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <Dialog open={isAddingTemplate} onOpenChange={setIsAddingTemplate}>
          <DialogTrigger asChild>
            <Button onClick={initNewTemplate}>
              <Plus className="mr-2 h-4 w-4" />
              Add Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Email Template</DialogTitle>
              <DialogDescription>
                Create a new email template for automated communications.
              </DialogDescription>
            </DialogHeader>
            {currentTemplate && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Template Name</Label>
                    <Input
                      id="name"
                      value={currentTemplate.name}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          name: e.target.value,
                        })
                      }
                      placeholder="e.g., Welcome Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">Template Type</Label>
                    <Select
                      value={currentTemplate.type}
                      onValueChange={(value) =>
                        setCurrentTemplate({ ...currentTemplate, type: value })
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select template type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="recommendation">
                          Recommendation
                        </SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="notification">
                          Notification
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Email Subject</Label>
                  <Input
                    id="subject"
                    value={currentTemplate.subject}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        subject: e.target.value,
                      })
                    }
                    placeholder="Enter email subject line"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">Email Content (HTML)</Label>
                  <Textarea
                    id="content"
                    value={currentTemplate.content}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        content: e.target.value,
                      })
                    }
                    placeholder="Enter HTML content for the email"
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {"{{"} user.name {"}}"}, {"{{"} user.email {"}}"}, etc.
                    as placeholders for dynamic content.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddingTemplate(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleAddTemplate}>Add Template</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Template Dialog */}
        <Dialog open={isEditingTemplate} onOpenChange={setIsEditingTemplate}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Email Template</DialogTitle>
              <DialogDescription>
                Update the email template details.
              </DialogDescription>
            </DialogHeader>
            {currentTemplate && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Template Name</Label>
                    <Input
                      id="edit-name"
                      value={currentTemplate.name}
                      onChange={(e) =>
                        setCurrentTemplate({
                          ...currentTemplate,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-type">Template Type</Label>
                    <Select
                      value={currentTemplate.type}
                      onValueChange={(value) =>
                        setCurrentTemplate({ ...currentTemplate, type: value })
                      }
                    >
                      <SelectTrigger id="edit-type">
                        <SelectValue placeholder="Select template type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="report">Report</SelectItem>
                        <SelectItem value="recommendation">
                          Recommendation
                        </SelectItem>
                        <SelectItem value="reminder">Reminder</SelectItem>
                        <SelectItem value="notification">
                          Notification
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-subject">Email Subject</Label>
                  <Input
                    id="edit-subject"
                    value={currentTemplate.subject}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        subject: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-content">Email Content (HTML)</Label>
                  <Textarea
                    id="edit-content"
                    value={currentTemplate.content}
                    onChange={(e) =>
                      setCurrentTemplate({
                        ...currentTemplate,
                        content: e.target.value,
                      })
                    }
                    className="min-h-[300px] font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use {"{{"} user.name {"}}"}, {"{{"} user.email {"}}"}, etc.
                    as placeholders for dynamic content.
                  </p>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditingTemplate(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleEditTemplate}>Save Changes</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* View Template Dialog */}
        <Dialog open={isViewingTemplate} onOpenChange={setIsViewingTemplate}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Email Template Preview</DialogTitle>
              <DialogDescription>
                {currentTemplate?.name} - {currentTemplate?.type}
              </DialogDescription>
            </DialogHeader>
            {currentTemplate && (
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Subject</Label>
                  <div className="p-2 border rounded-md bg-muted/20">
                    {currentTemplate.subject}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Content Preview</Label>
                  <div className="border rounded-md p-4 max-h-[400px] overflow-auto bg-white">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: currentTemplate.content,
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Template Information</Label>
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Created:</strong> {currentTemplate.createdAt}
                    </p>
                    <p>
                      <strong>Last Updated:</strong> {currentTemplate.updatedAt}
                    </p>
                  </div>
                </div>
              </div>
            )}
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsViewingTemplate(false)}
              >
                Close
              </Button>
              <Button
                onClick={() => {
                  setIsViewingTemplate(false);
                  initEditTemplate(currentTemplate!);
                }}
              >
                Edit Template
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Mail className="h-5 w-5 mr-2 text-primary" />
            Email Templates
          </CardTitle>
          <CardDescription>
            Manage email templates for automated communications with users
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center py-4 text-muted-foreground"
                    >
                      No email templates found. Add your first template.
                    </TableCell>
                  </TableRow>
                ) : (
                  templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        {template.name}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                          {template.type}
                        </span>
                      </TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {template.subject}
                      </TableCell>
                      <TableCell>{template.updatedAt}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => viewTemplate(template)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => initEditTemplate(template)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteTemplate(template.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
