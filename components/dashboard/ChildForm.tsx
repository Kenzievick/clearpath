"use client";

import { useState } from "react";
import Link from "next/link";
import { Field, Button, NAVY, INK, MUTED, inputClass, inputStyle } from "./ui";
import type { ChildInput } from "@/app/(dashboard)/dashboard/children/actions";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const GRADES = [
  "Pre-K","Kindergarten","1st","2nd","3rd","4th","5th","6th","7th","8th","9th","10th","11th","12th","Post-secondary",
];

const IDEA_CATEGORIES = [
  "Autism",
  "Deaf-Blindness",
  "Deafness",
  "Emotional Disturbance",
  "Hearing Impairment",
  "Intellectual Disability",
  "Multiple Disabilities",
  "Orthopedic Impairment",
  "Other Health Impairment",
  "Specific Learning Disability",
  "Speech or Language Impairment",
  "Traumatic Brain Injury",
  "Visual Impairment Including Blindness",
];

type FormState = {
  first_name: string;
  age: string;
  grade: string;
  school_name: string;
  school_district: string;
  state: string;
  evaluation_type: string;
  disability_categories: string[];
  additional_context: string;
};

const emptyForm: FormState = {
  first_name: "",
  age: "",
  grade: "",
  school_name: "",
  school_district: "",
  state: "",
  evaluation_type: "Initial Evaluation",
  disability_categories: [],
  additional_context: "",
};

export default function ChildForm({
  mode,
  initial,
  onSubmit,
}: {
  mode: "create" | "edit";
  initial?: Partial<FormState>;
  onSubmit: (input: ChildInput) => Promise<{ error?: string } | void>;
}) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({ ...emptyForm, ...initial });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirm, setConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: "" }));
  }

  function toggleCategory(c: string) {
    set(
      "disability_categories",
      form.disability_categories.includes(c)
        ? form.disability_categories.filter((x) => x !== c)
        : [...form.disability_categories, c]
    );
  }

  function validateStep1() {
    const e: Record<string, string> = {};
    if (!form.first_name.trim()) e.first_name = "Required";
    if (!form.age || Number(form.age) <= 0) e.age = "Required";
    if (!form.grade) e.grade = "Required";
    if (!form.state) e.state = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (step === 1 && !validateStep1()) return;
    setStep((s) => s + 1);
  }
  function back() {
    setStep((s) => s - 1);
  }

  async function submit() {
    if (!confirm) return;
    setSubmitting(true);
    setSubmitError(null);
    const result = await onSubmit({
      first_name: form.first_name.trim(),
      age: Number(form.age),
      grade: form.grade,
      school_name: form.school_name.trim() || null,
      school_district: form.school_district.trim() || null,
      state: form.state,
      evaluation_type: form.evaluation_type,
      disability_categories: form.disability_categories,
      additional_context: form.additional_context.trim() || null,
    });
    if (result && "error" in result && result.error) {
      setSubmitError(result.error);
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-2 flex-1">
            <div
              className="flex items-center justify-center rounded-full font-bold flex-shrink-0"
              style={{
                width: "28px",
                height: "28px",
                background: step >= n ? NAVY : "#E5E7EB",
                color: step >= n ? "#FFFFFF" : MUTED,
                fontSize: "13px",
              }}
            >
              {n}
            </div>
            <div className="text-sm font-medium" style={{ color: step >= n ? INK : MUTED }}>
              {n === 1 ? "Basics" : n === 2 ? "Disability" : "Review"}
            </div>
            {n < 3 && <div className="flex-1 h-px" style={{ background: "#E5E7EB" }} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="space-y-5">
          <Field label="First name" required error={errors.first_name}>
            <input
              type="text"
              value={form.first_name}
              onChange={(e) => set("first_name", e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Age" required error={errors.age}>
              <input
                type="number"
                min={1}
                value={form.age}
                onChange={(e) => set("age", e.target.value)}
                className={inputClass}
                style={inputStyle}
              />
            </Field>
            <Field label="Grade" required error={errors.grade}>
              <select
                value={form.grade}
                onChange={(e) => set("grade", e.target.value)}
                className={inputClass}
                style={inputStyle}
              >
                <option value="">Select grade</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="School name">
            <input
              type="text"
              value={form.school_name}
              onChange={(e) => set("school_name", e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </Field>

          <Field label="School district">
            <input
              type="text"
              value={form.school_district}
              onChange={(e) => set("school_district", e.target.value)}
              className={inputClass}
              style={inputStyle}
            />
          </Field>

          <Field label="State" required error={errors.state}>
            <select
              value={form.state}
              onChange={(e) => set("state", e.target.value)}
              className={inputClass}
              style={inputStyle}
            >
              <option value="">Select state</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </Field>

          <Field label="Evaluation type" required>
            <div className="flex flex-col sm:flex-row gap-3">
              {["Initial Evaluation", "Re-evaluation"].map((opt) => {
                const active = form.evaluation_type === opt;
                return (
                  <label
                    key={opt}
                    className="flex items-center gap-3 cursor-pointer rounded-lg flex-1"
                    style={{
                      border: `1px solid ${active ? NAVY : "#D1D5DB"}`,
                      background: active ? "#EEF2F9" : "#fff",
                      padding: "12px 16px",
                    }}
                  >
                    <input
                      type="radio"
                      name="evaluation_type"
                      value={opt}
                      checked={active}
                      onChange={() => set("evaluation_type", opt)}
                      className="accent-[#1B3A6B]"
                    />
                    <span style={{ color: INK, fontSize: "14px", fontWeight: 500 }}>
                      {opt}
                    </span>
                  </label>
                );
              })}
            </div>
          </Field>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <div>
            <span className="block mb-3 font-medium" style={{ color: INK, fontSize: "14px" }}>
              IDEA disability categories
            </span>
            <p className="mb-4" style={{ color: MUTED, fontSize: "13px" }}>
              Select all that apply. You can change these later.
            </p>
            <div className="grid sm:grid-cols-2 gap-2">
              {IDEA_CATEGORIES.map((c) => {
                const checked = form.disability_categories.includes(c);
                return (
                  <label
                    key={c}
                    className="flex items-center gap-3 rounded-lg cursor-pointer"
                    style={{
                      border: `1px solid ${checked ? NAVY : "#E5E7EB"}`,
                      background: checked ? "#EEF2F9" : "#fff",
                      padding: "10px 12px",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(c)}
                      className="accent-[#1B3A6B]"
                    />
                    <span style={{ color: INK, fontSize: "13px" }}>{c}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <Field
            label="Additional context"
            hint="Optional, but helps Clearpath tailor the brief."
          >
            <textarea
              rows={5}
              value={form.additional_context}
              onChange={(e) => set("additional_context", e.target.value)}
              placeholder="Any additional details about your child's specific challenges, strengths, or history that would help Clearpath personalize the brief."
              className={inputClass}
              style={inputStyle}
            />
          </Field>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "20px" }}>
            <h3 className="font-bold mb-3" style={{ color: INK, fontSize: "15px" }}>Basics</h3>
            <dl className="space-y-1.5 text-sm">
              <Row label="First name" value={form.first_name} />
              <Row label="Age" value={form.age} />
              <Row label="Grade" value={form.grade} />
              <Row label="School" value={form.school_name || "—"} />
              <Row label="District" value={form.school_district || "—"} />
              <Row label="State" value={form.state} />
              <Row label="Evaluation type" value={form.evaluation_type} />
            </dl>
          </div>

          <div className="rounded-xl" style={{ background: "#fff", border: "1px solid #E5E7EB", padding: "20px" }}>
            <h3 className="font-bold mb-3" style={{ color: INK, fontSize: "15px" }}>Disability information</h3>
            <p className="mb-2" style={{ color: MUTED, fontSize: "13px" }}>
              {form.disability_categories.length === 0
                ? "None selected"
                : form.disability_categories.join(", ")}
            </p>
            {form.additional_context && (
              <p style={{ color: INK, fontSize: "13px", lineHeight: 1.6, marginTop: "8px" }}>
                {form.additional_context}
              </p>
            )}
          </div>

          <label
            className="flex items-start gap-3 rounded-lg cursor-pointer"
            style={{
              border: `1px solid ${confirm ? NAVY : "#D1D5DB"}`,
              background: confirm ? "#EEF2F9" : "#fff",
              padding: "14px 16px",
            }}
          >
            <input
              type="checkbox"
              checked={confirm}
              onChange={(e) => setConfirm(e.target.checked)}
              className="mt-0.5 accent-[#1B3A6B]"
            />
            <span style={{ color: INK, fontSize: "13px", lineHeight: 1.6 }}>
              I confirm that I am the parent or legal guardian of this child and
              have the right to upload and process their educational records.
            </span>
          </label>

          {submitError && (
            <p className="text-sm font-medium" style={{ color: "#C04A3A" }}>
              {submitError}
            </p>
          )}
        </div>
      )}

      {/* Nav */}
      <div className="flex items-center justify-between gap-3 mt-10 pt-6" style={{ borderTop: "1px solid #E5E7EB" }}>
        {step > 1 ? (
          <Button variant="outline" onClick={back}>Back</Button>
        ) : (
          <Link
            href="/dashboard/children"
            className="text-sm font-medium hover:underline"
            style={{ color: MUTED }}
          >
            Cancel
          </Link>
        )}
        {step < 3 ? (
          <Button onClick={next}>Next</Button>
        ) : (
          <Button onClick={submit} disabled={!confirm || submitting}>
            {submitting ? "Saving..." : mode === "create" ? "Create Profile" : "Save Changes"}
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <dt style={{ color: MUTED }}>{label}</dt>
      <dd className="font-medium text-right" style={{ color: INK }}>{value}</dd>
    </div>
  );
}
