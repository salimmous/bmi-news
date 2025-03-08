import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
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
import { Pencil, Plus, Trash2 } from "lucide-react";

interface Recommendation {
  id: string;
  category: string;
  bmiRange: string;
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

// Mock recommendation data
const mockRecommendations: Recommendation[] = [
  {
    id: "1",
    category: "underweight",
    bmiRange: "< 18.5",
    title: "Increase Caloric Intake",
    description:
      "Focus on nutrient-dense foods to gain weight in a healthy way. Include protein-rich foods, healthy fats, and complex carbohydrates in your diet.",
    priority: "high",
  },
  {
    id: "2",
    category: "underweight",
    bmiRange: "< 18.5",
    title: "Strength Training",
    description:
      "Incorporate resistance training to build muscle mass. Aim for 2-3 sessions per week focusing on major muscle groups.",
    priority: "medium",
  },
  {
    id: "3",
    category: "normal",
    bmiRange: "18.5 - 24.9",
    title: "Maintain Balanced Diet",
    description:
      "Continue with a balanced diet rich in fruits, vegetables, lean proteins, and whole grains to maintain your healthy weight.",
    priority: "medium",
  },
  {
    id: "4",
    category: "normal",
    bmiRange: "18.5 - 24.9",
    title: "Regular Physical Activity",
    description:
      "Maintain at least 150 minutes of moderate-intensity exercise per week to support overall health and weight maintenance.",
    priority: "medium",
  },
  {
    id: "5",
    category: "overweight",
    bmiRange: "25 - 29.9",
    title: "Caloric Deficit",
    description:
      "Create a moderate caloric deficit through diet and exercise. Aim for 500-750 fewer calories per day to lose 0.5-1 kg per week.",
    priority: "high",
  },
  {
    id: "6",
    category: "overweight",
    bmiRange: "25 - 29.9",
    title: "Increase Physical Activity",
    description:
      "Aim for 150-300 minutes of moderate-intensity exercise per week, combining cardio and strength training for optimal results.",
    priority: "high",
  },
  {
    id: "7",
    category: "obese",
    bmiRange: ">= 30",
    title: "Medical Consultation",
    description:
      "Consult with healthcare providers for a comprehensive weight management plan. They can provide personalized advice and monitor health markers.",
    priority: "high",
  },
  {
    id: "8",
    category: "obese",
    bmiRange: ">= 30",
    title: "Gradual Lifestyle Changes",
    description:
      "Focus on sustainable lifestyle changes rather than quick fixes. Start with small, achievable goals to build momentum.",
    priority: "high",
  },
];

export function HealthRecommendations() {
  const [recommendations, setRecommendations] =
    useState<Recommendation[]>(mockRecommendations);
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingRecommendation, setEditingRecommendation] =
    useState<Recommendation | null>(null);

  // New recommendation form state
  const [newRecommendation, setNewRecommendation] = useState<
    Omit<Recommendation, "id">
  >({
    category: "normal",
    bmiRange: "18.5 - 24.9",
    title: "",
    description: "",
    priority: "medium",
  });

  const filteredRecommendations =
    activeTab === "all"
      ? recommendations
      : recommendations.filter((rec) => rec.category === activeTab);

  const handleAddRecommendation = () => {
    const recommendation: Recommendation = {
      id: Math.random().toString(36).substring(2, 9),
      ...newRecommendation,
    };

    setRecommendations([...recommendations, recommendation]);
    setNewRecommendation({
      category: "normal",
      bmiRange: "18.5 - 24.9",
      title: "",
      description: "",
      priority: "medium",
    });
    setIsAddDialogOpen(false);
  };

  const handleEditRecommendation = () => {
    if (!editingRecommendation) return;

    setRecommendations(
      recommendations.map((rec) =>
        rec.id === editingRecommendation.id ? editingRecommendation : rec,
      ),
    );

    setIsEditDialogOpen(false);
    setEditingRecommendation(null);
  };

  const handleDeleteRecommendation = (id: string) => {
    setRecommendations(recommendations.filter((rec) => rec.id !== id));
  };

  const getCategoryBmiRange = (category: string): string => {
    switch (category) {
      case "underweight":
        return "< 18.5";
      case "normal":
        return "18.5 - 24.9";
      case "overweight":
        return "25 - 29.9";
      case "obese":
        return ">= 30";
      default:
        return "";
    }
  };

  const handleCategoryChange = (category: string, target: "new" | "edit") => {
    const bmiRange = getCategoryBmiRange(category);

    if (target === "new") {
      setNewRecommendation({ ...newRecommendation, category, bmiRange });
    } else if (editingRecommendation) {
      setEditingRecommendation({
        ...editingRecommendation,
        category,
        bmiRange,
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle>Health Recommendations</CardTitle>
            <CardDescription>
              Manage BMI-based health recommendations
            </CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Recommendation
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Recommendation</DialogTitle>
                <DialogDescription>
                  Create a new health recommendation for users.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category">BMI Category</Label>
                  <Select
                    value={newRecommendation.category}
                    onValueChange={(value) =>
                      handleCategoryChange(value, "new")
                    }
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="underweight">Underweight</SelectItem>
                      <SelectItem value="normal">Normal Weight</SelectItem>
                      <SelectItem value="overweight">Overweight</SelectItem>
                      <SelectItem value="obese">Obese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Recommendation Title</Label>
                  <Input
                    id="title"
                    value={newRecommendation.title}
                    onChange={(e) =>
                      setNewRecommendation({
                        ...newRecommendation,
                        title: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={newRecommendation.description}
                    onChange={(e) =>
                      setNewRecommendation({
                        ...newRecommendation,
                        description: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select
                    value={newRecommendation.priority}
                    onValueChange={(value: "high" | "medium" | "low") =>
                      setNewRecommendation({
                        ...newRecommendation,
                        priority: value,
                      })
                    }
                  >
                    <SelectTrigger id="priority">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleAddRecommendation}>
                  Add Recommendation
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="underweight">Underweight</TabsTrigger>
            <TabsTrigger value="normal">Normal</TabsTrigger>
            <TabsTrigger value="overweight">Overweight</TabsTrigger>
            <TabsTrigger value="obese">Obese</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>BMI Range</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecommendations.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="text-center py-4 text-muted-foreground"
                      >
                        No recommendations found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecommendations.map((rec) => (
                      <TableRow key={rec.id}>
                        <TableCell className="capitalize">
                          {rec.category}
                        </TableCell>
                        <TableCell>{rec.bmiRange}</TableCell>
                        <TableCell className="font-medium">
                          {rec.title}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          {rec.description}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              rec.priority === "high"
                                ? "bg-red-100 text-red-800"
                                : rec.priority === "medium"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-green-100 text-green-800"
                            }`}
                          >
                            {rec.priority}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Dialog
                            open={
                              isEditDialogOpen &&
                              editingRecommendation?.id === rec.id
                            }
                            onOpenChange={(open) => {
                              setIsEditDialogOpen(open);
                              if (!open) setEditingRecommendation(null);
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setEditingRecommendation(rec)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-md">
                              <DialogHeader>
                                <DialogTitle>Edit Recommendation</DialogTitle>
                                <DialogDescription>
                                  Update health recommendation details.
                                </DialogDescription>
                              </DialogHeader>
                              {editingRecommendation && (
                                <div className="space-y-4 py-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-category">
                                      BMI Category
                                    </Label>
                                    <Select
                                      value={editingRecommendation.category}
                                      onValueChange={(value) =>
                                        handleCategoryChange(value, "edit")
                                      }
                                    >
                                      <SelectTrigger id="edit-category">
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="underweight">
                                          Underweight
                                        </SelectItem>
                                        <SelectItem value="normal">
                                          Normal Weight
                                        </SelectItem>
                                        <SelectItem value="overweight">
                                          Overweight
                                        </SelectItem>
                                        <SelectItem value="obese">
                                          Obese
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-title">
                                      Recommendation Title
                                    </Label>
                                    <Input
                                      id="edit-title"
                                      value={editingRecommendation.title}
                                      onChange={(e) =>
                                        setEditingRecommendation({
                                          ...editingRecommendation,
                                          title: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-description">
                                      Description
                                    </Label>
                                    <Textarea
                                      id="edit-description"
                                      rows={4}
                                      value={editingRecommendation.description}
                                      onChange={(e) =>
                                        setEditingRecommendation({
                                          ...editingRecommendation,
                                          description: e.target.value,
                                        })
                                      }
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="edit-priority">
                                      Priority
                                    </Label>
                                    <Select
                                      value={editingRecommendation.priority}
                                      onValueChange={(
                                        value: "high" | "medium" | "low",
                                      ) =>
                                        setEditingRecommendation({
                                          ...editingRecommendation,
                                          priority: value,
                                        })
                                      }
                                    >
                                      <SelectTrigger id="edit-priority">
                                        <SelectValue placeholder="Select priority" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="high">
                                          High
                                        </SelectItem>
                                        <SelectItem value="medium">
                                          Medium
                                        </SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              )}
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setIsEditDialogOpen(false)}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleEditRecommendation}>
                                  Save Changes
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteRecommendation(rec.id)}
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
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
