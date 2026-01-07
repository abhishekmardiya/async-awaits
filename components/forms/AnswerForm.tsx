"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import { ReloadIcon } from "@radix-ui/react-icons";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createAnswer } from "@/lib/actions/answer.action";
import { AnswerSchema } from "@/lib/validations";

const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
});

interface Params {
  questionId: string;
  questionTitle: string;
  questionContent: string;
}

export const AnswerForm = ({
  questionId,
  questionTitle,
  questionContent,
}: Params) => {
  const { refresh } = useRouter();
  const [isAnswering, startAnsweringTransition] = useTransition();
  const [isAISubmitting, setIsAISubmitting] = useState(false);

  const session = useSession();

  const editorRef = useRef<MDXEditorMethods>(null);
  const generationRef = useRef<string>("");

  const form = useForm<z.infer<typeof AnswerSchema>>({
    resolver: zodResolver(AnswerSchema),
    defaultValues: {
      content: "",
    },
  });

  const generateAIAnswer = async () => {
    if (session.status !== "authenticated") {
      return toast.error(
        "Please log in. You need to be logged in to use this feature"
      );
    }

    setIsAISubmitting(true);

    const userAnswer = editorRef.current?.getMarkdown();

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${API_BASE_URL}/ai/answers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: questionTitle,
          content: questionContent,
          userAnswer,
        }),
      });

      if (!response?.ok) {
        let errorData: { error?: { message?: string } } = {};

        try {
          errorData = await response?.json();
        } catch {
          errorData = {};
        }

        return toast.error(
          errorData?.error?.message || "Failed to generate answer"
        );
      }

      // Reset generation ref
      generationRef.current = "";

      if (editorRef.current && response?.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();

            if (done) {
              break;
            }

            // Decode the chunk and accumulate in the ref
            const chunk = decoder.decode(value, { stream: true });
            generationRef.current = `${generationRef.current}${chunk}`;

            // Replace <br> with a space and format
            const formattedAnswer = generationRef.current
              .replace(/<br>/g, " ")
              .toString()
              .trim();

            // Update editor with accumulated content
            editorRef.current.setMarkdown(formattedAnswer);

            // Manually set the value of the content field and trigger the content field to validate the field
            form.setValue("content", formattedAnswer);
            form.trigger("content");
          }
        } finally {
          reader.releaseLock();
        }
      }

      toast.success("AI generated answer has been generated");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "There was a problem with your request"
      );
    } finally {
      setIsAISubmitting(false);
    }
  };

  const handleSubmit = async (values: z.infer<typeof AnswerSchema>) => {
    startAnsweringTransition(async () => {
      const result = await createAnswer({
        questionId,
        content: values?.content,
      });

      if (result?.success) {
        form.reset();

        toast.success("Your answer has been posted successfully");

        if (editorRef.current) {
          editorRef.current.setMarkdown("");
        }

        refresh();
      } else {
        toast.error(result?.error?.message);
      }
    });
  };

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
        <h4 className="paragraph-semibold text-dark400_light800">
          Write your answer here
        </h4>
        <Button
          className="btn light-border-2 gap-1.5 rounded-md border px-4 py-2.5 text-primary-500 shadow-none dark:text-primary-500"
          disabled={isAISubmitting}
          onClick={generateAIAnswer}
        >
          {isAISubmitting ? (
            <>
              <ReloadIcon className="mr-2 size-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Image
                src="/icons/stars.svg"
                alt="Enhance Answer With AI"
                width={12}
                height={12}
                className="object-contain"
              />
              Enhance Answer With AI
            </>
          )}
        </Button>
      </div>
      <Form {...form}>
        <form
          onSubmit={form?.handleSubmit(handleSubmit)}
          className="mt-6 flex w-full flex-col gap-10"
        >
          <FormField
            control={form?.control}
            name="content"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-3">
                <FormControl className="mt-3.5">
                  <Editor
                    value={field?.value}
                    ref={editorRef}
                    fieldChange={field?.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button type="submit" className="primary-gradient w-fit">
              {isAnswering ? (
                <>
                  <ReloadIcon className="mr-2 size-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post Answer"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
