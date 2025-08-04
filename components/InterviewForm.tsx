"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCurrentUser } from "@/lib/actions/auth.action";

interface InterviewFormProps {
  userId: string;
}

const InterviewForm = ({ userId }: InterviewFormProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: "",
    level: "Junior",
    type: "Mixed",
    techstack: "",
    amount: "5"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          userid: userId,
        }),
      });

      if (response.ok) {
        router.push("/interview");
        router.refresh();
      } else {
        throw new Error("Failed to generate interview");
      }
    } catch (error) {
      console.error("Error generating interview:", error);
      alert("Failed to generate interview. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
      <h3 className="text-2xl font-bold text-lime-400 mb-6">Generate New Interview</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role */}
        <div>
          <Label htmlFor="role" className="text-lime-400">Job Role</Label>
          <Input
            id="role"
            type="text"
            placeholder="e.g., Frontend Developer, Full Stack Engineer"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
            className="bg-gray-700/50 border-gray-600 text-lime-100 placeholder-gray-400"
          />
        </div>

        {/* Level */}
        <div>
          <Label htmlFor="level" className="text-lime-400">Experience Level</Label>
          <select
            id="level"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: e.target.value })}
            className="w-full bg-gray-700/50 border border-gray-600 text-lime-100 rounded-md px-3 py-2"
          >
            <option value="Junior">Junior</option>
            <option value="Mid-level">Mid-level</option>
            <option value="Senior">Senior</option>
            <option value="Lead">Lead</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <Label htmlFor="type" className="text-lime-400">Question Type</Label>
          <select
            id="type"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="w-full bg-gray-700/50 border border-gray-600 text-lime-100 rounded-md px-3 py-2"
          >
            <option value="Technical">Technical</option>
            <option value="Behavioral">Behavioral</option>
            <option value="Mixed">Mixed</option>
          </select>
        </div>

        {/* Tech Stack */}
        <div>
          <Label htmlFor="techstack" className="text-lime-400">Tech Stack (comma-separated)</Label>
          <Input
            id="techstack"
            type="text"
            placeholder="e.g., React, TypeScript, Node.js, MongoDB"
            value={formData.techstack}
            onChange={(e) => setFormData({ ...formData, techstack: e.target.value })}
            required
            className="bg-gray-700/50 border-gray-600 text-lime-100 placeholder-gray-400"
          />
        </div>

        {/* Amount */}
        <div>
          <Label htmlFor="amount" className="text-lime-400">Number of Questions</Label>
          <select
            id="amount"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full bg-gray-700/50 border border-gray-600 text-lime-100 rounded-md px-3 py-2"
          >
            <option value="3">3 Questions</option>
            <option value="5">5 Questions</option>
            <option value="7">7 Questions</option>
            <option value="10">10 Questions</option>
          </select>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full text-black hover:bg-lime-400/60 bg-lime-400 font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
        >
          {isLoading ? "Generating..." : "Generate Interview"}
        </Button>
      </form>
    </div>
  );
};

export default InterviewForm; 