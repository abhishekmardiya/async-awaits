"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { z, ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ROUTES } from "@/constants/routes";

import { NextLink } from "../NextLink";
import { Input } from "../ui/input";

interface AuthFormProps<T extends FieldValues> {
  formType: "SIGN_IN" | "SIGN_UP";
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
}

const AuthForm = <T extends FieldValues>({
  formType,
  schema,
  defaultValues,
  onSubmit,
}: AuthFormProps<T>) => {
  const { push } = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as ActionResponse;

    if (result?.success) {
      toast.success("Success", {
        description:
          formType === "SIGN_IN"
            ? "Signed in successfully!"
            : "Signed up successfully!",
      });

      push(ROUTES?.HOME);
    } else {
      toast.error(`Error ${result?.status}`, {
        description: result?.error?.message,
      });
    }
  };

  const buttonText = formType === "SIGN_IN" ? "Sign In" : "Sign Up";
  const linkClass = "paragraph-semibold primary-text-gradient";

  return (
    <Form {...form}>
      <form
        onSubmit={form?.handleSubmit(handleSubmit)}
        className="mt-10 space-y-6"
        noValidate
      >
        {Object.keys(defaultValues)?.map((field) => (
          <FormField
            key={field}
            control={form?.control}
            name={field as Path<T>}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col gap-2.5">
                <FormLabel className="paragraph-medium text-dark400_light700 capitalize">
                  {field?.name}
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      required
                      type={
                        field?.name === "password" && !showPassword
                          ? "password"
                          : "text"
                      }
                      {...field}
                      className="paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 no-focus min-h-12 rounded-1.5 border"
                    />
                    {/* FIXME:add eye icon */}
                    {field?.name === "password" && (
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="text-dark400_light700 absolute inset-y-0 right-3 flex items-center"
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button
          type="submit"
          className="primary-gradient paragraph-medium min-h-12 w-full rounded-2 px-4 py-3 font-inter !text-light-900"
          disabled={form?.formState?.isSubmitting}
        >
          {form?.formState?.isSubmitting
            ? buttonText === "Sign In"
              ? "Signing In..."
              : "Signing Up..."
            : buttonText}
        </Button>
        {formType === "SIGN_IN" ? (
          <p>
            Don&apos;t have an account?{" "}
            <NextLink href={ROUTES?.SIGN_UP} className={linkClass}>
              Sign Up
            </NextLink>
          </p>
        ) : (
          <p>
            Already have an account?{" "}
            <NextLink href={ROUTES?.SIGN_IN} className={linkClass}>
              Sign In
            </NextLink>
          </p>
        )}
      </form>
    </Form>
  );
};

export default AuthForm;
