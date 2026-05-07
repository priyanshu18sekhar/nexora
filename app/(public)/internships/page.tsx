import React from "react";
import Link from "next/link";
import { MapPin, Briefcase, Clock, Search, Filter, Building } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Badge } from "@/src/components/ui/badge";
import { Card, CardContent } from "@/src/components/ui/card";
import { db } from "@/src/lib/db";
import { formatRelativeTime } from "@/src/lib/utils";

const MOCK_INTERNSHIPS = [
  {
    id: "mock-int-1",
    title: "Software Engineering Intern",
    company: "TechNova Solutions",
    location: "Bangalore, India",
    isRemote: true,
    stipend: 500,
    duration: "3 Months",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    skills: ["React", "Node.js", "TypeScript"],
  },
  {
    id: "mock-int-2",
    title: "Product Design Intern",
    company: "CreativeFlow",
    location: "Remote",
    isRemote: true,
    stipend: 300,
    duration: "6 Months",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    skills: ["Figma", "UI/UX", "Prototyping"],
  },
];

export default async function InternshipsPage() {
  let internships: any[] = [];
  try {
    internships = await db.internship.findMany({
      where: { status: "OPEN" },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch internships:", error);
  }

  const displayInternships = internships.length > 0 ? internships : MOCK_INTERNSHIPS;

  return (
    <div className="pt-20 pb-16 min-h-screen bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find Internships</h1>
            <p className="text-muted-foreground">
              Kickstart your career with top companies
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Input
                placeholder="Search internships..."
                leftIcon={<Search className="w-4 h-4" />}
                className="w-full bg-background"
              />
            </div>
            <Button variant="outline" size="icon" className="shrink-0 bg-background">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 mb-8">
          <Badge variant="default" className="px-4 py-2 cursor-pointer">
            All Internships
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer bg-background hover:bg-muted">
            Remote Only
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer bg-background hover:bg-muted">
            Paid Internships
          </Badge>
          <Badge variant="outline" className="px-4 py-2 cursor-pointer bg-background hover:bg-muted">
            Tech & Engineering
          </Badge>
        </div>

        {/* List */}
        <div className="space-y-4">
          {displayInternships.map((internship) => (
            <Link key={internship.id} href={`/internships/${internship.id}`}>
              <Card variant="hover" className="transition-all duration-200">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Company Logo */}
                    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0 border border-border">
                      {internship.companyLogo ? (
                        <img src={internship.companyLogo} alt={internship.company} className="w-full h-full object-cover rounded-xl" />
                      ) : (
                        <Building className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-2">
                        <div>
                          <h2 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">
                            {internship.title}
                          </h2>
                          <div className="text-muted-foreground font-medium flex items-center gap-2">
                            {internship.company}
                            {internship.isRemote && (
                              <Badge variant="success" className="h-5 text-[10px]">Remote</Badge>
                            )}
                          </div>
                        </div>
                        <Button className="shrink-0 sm:self-start">Apply Now</Button>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-sm text-muted-foreground mt-4 mb-4">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {internship.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-4 h-4" />
                          {internship.duration}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground">
                            {internship.stipend ? `$${internship.stipend}/mo` : "Unpaid"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {formatRelativeTime(internship.createdAt)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {internship.skills.slice(0, 4).map((skill: string) => (
                          <span
                            key={skill}
                            className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground"
                          >
                            {skill}
                          </span>
                        ))}
                        {internship.skills.length > 4 && (
                          <span className="px-2.5 py-1 rounded-md bg-muted text-xs font-medium text-muted-foreground">
                            +{internship.skills.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
