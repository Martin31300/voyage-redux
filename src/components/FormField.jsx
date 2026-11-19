import { Form } from "react-bootstrap";

export default function FormField({
  label,
  name,
  register,
  errors,
  type = "text",
  as,
  rows,
  options,
  placeholder,
}) {
  const invalid = !!errors[name];
  return (
    <Form.Group className="mb-3" controlId={name}>
      <Form.Label>{label}</Form.Label>
      {options ? (
        <Form.Select isInvalid={invalid} {...register(name)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          type={type}
          as={as}
          rows={rows}
          placeholder={placeholder}
          isInvalid={invalid}
          {...register(name)}
        />
      )}
      <Form.Control.Feedback type="invalid">{errors[name]?.message}</Form.Control.Feedback>
    </Form.Group>
  );
}
