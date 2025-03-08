import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Button } from "./button";
import { Trash2, History, FileDown, Search } from "lucide-react";
import { Input } from "./input";
import { useState } from "react";

interface BMIRecord {
  id: string;
  date: string;
  bmi: number;
  weight: number;
  height: number;
}

interface BMIHistoryProps {
  records: BMIRecord[];
  onDelete?: (id: string) => void;
}

export function BMIHistory({ records = [], onDelete }: BMIHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Sort records by date (newest first)
  const sortedRecords = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  // Filter records based on search term
  const filteredRecords = sortedRecords.filter((record) => {
    const category = getBMICategory(record.bmi).toLowerCase();
    const date = formatDate(record.date).toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return (
      category.includes(searchLower) ||
      date.includes(searchLower) ||
      record.bmi.toString().includes(searchLower) ||
      record.weight.toString().includes(searchLower) ||
      record.height.toString().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getBMICategory = (bmi: number): string => {
    if (bmi < 18.5) return "Underweight";
    if (bmi >= 18.5 && bmi < 25) return "Normal weight";
    if (bmi >= 25 && bmi < 30) return "Overweight";
    return "Obese";
  };

  const getCategoryColor = (bmi: number): string => {
    if (bmi < 18.5) return "text-blue-500";
    if (bmi >= 18.5 && bmi < 25) return "text-green-500";
    if (bmi >= 25 && bmi < 30) return "text-orange-500";
    return "text-red-500";
  };

  const exportToCSV = () => {
    if (records.length === 0) return;

    const headers = ["Date", "Weight (kg)", "Height (cm)", "BMI", "Category"];
    const csvData = records.map((record) => [
      formatDate(record.date),
      record.weight,
      record.height,
      record.bmi,
      getBMICategory(record.bmi),
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `bmi_history_${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <History className="h-5 w-5 mr-2 text-primary" />
            <CardTitle>BMI History</CardTitle>
          </div>
          {records.length > 0 && (
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          )}
        </div>
        <CardDescription>Your previous BMI measurements</CardDescription>
      </CardHeader>
      <CardContent>
        {sortedRecords.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-muted/30 rounded-md border border-dashed border-muted">
            <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
            <p>No BMI records available. Start by calculating your BMI.</p>
          </div>
        ) : (
          <>
            <div className="mb-4 relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search records..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Date</TableHead>
                    <TableHead>Weight (kg)</TableHead>
                    <TableHead>Height (cm)</TableHead>
                    <TableHead>BMI</TableHead>
                    <TableHead>Category</TableHead>
                    {onDelete && (
                      <TableHead className="w-[80px] text-right">
                        Actions
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={onDelete ? 6 : 5}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No matching records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredRecords.map((record) => (
                      <TableRow key={record.id} className="hover:bg-muted/30">
                        <TableCell>{formatDate(record.date)}</TableCell>
                        <TableCell>{record.weight}</TableCell>
                        <TableCell>{record.height}</TableCell>
                        <TableCell className="font-medium">
                          {record.bmi}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(record.bmi)} bg-opacity-10`}
                            style={{
                              backgroundColor: `${getCategoryColor(record.bmi).replace("text", "bg").replace("-500", "-100")}`,
                            }}
                          >
                            {getBMICategory(record.bmi)}
                          </span>
                        </TableCell>
                        {onDelete && (
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(record.id)}
                              aria-label="Delete record"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <div className="mt-2 text-xs text-muted-foreground text-right">
              Showing {filteredRecords.length} of {records.length} records
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
