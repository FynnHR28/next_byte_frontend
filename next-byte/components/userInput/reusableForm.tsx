import { Children, createElement, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { buttonStyle } from "@/app/auth/styles";



const ReForm = ({ defaultValues, children, onSubmit, className, error }:any) =>  {
  const methods = useForm({ defaultValues });
  const { register, formState, handleSubmit } = methods;
  const { errors } = formState;

  const [isSubmitting, setIsSubmitting] = useState(false);

  


  return (
    <form className={`flex-col ${className}`} onSubmit={handleSubmit(onSubmit)}>
      {Children.map(children, (child) => {
        return child.props.name
          ? createElement(child.type, {
              ...{
                ...child.props,
                register: register,
                errors: errors[child.props.name]?.message,
                key: child.props.name,
              },
            })
          : child
      })}
      <button
        className={buttonStyle}
        style={{ fontFamily: "Georgia" }}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
      {error ? (
            <p className="text-sm text-red-600" style={{ fontFamily: "Verdana" }}>
              {error}
            </p>
      ) : null}
    </form>
  )
}

export default ReForm