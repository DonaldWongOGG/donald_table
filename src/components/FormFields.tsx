import { Fragment } from 'react';
import styles from '@/components/FormFields.module.scss';

/** Single field config for the dynamic form. */
export type FieldConfig =
  | { label: string; name: string; type: 'text'; requiredText?: string; required?: boolean; className: string }
  | { label: string; name: string; type: 'textarea'; requiredText?: string; className: string; rows?: number }
  | { label: string; name: string; type: 'number'; requiredText?: string; className: string; min?: number; max?: number; step?: number };

/** Array of fields = one row; single field = full width. */
export type FormFieldsConfig = (FieldConfig | FieldConfig[])[];

export interface FormFieldsProps {
  fields: FormFieldsConfig;
  values: Record<string, unknown>;
  onChange: (name: string, value: unknown) => void;
  getClass: (className: string) => string;
}

/**
 * Renders a form section from a config of fields.
 * Supports text, textarea, and number. Group fields in an array to render them in a row.
 */
export function FormFields(
  { fields, values, onChange, getClass }: FormFieldsProps
) {
  const renderField = (field: FieldConfig) => {
    const value = values[field.name];
    const required = field.type === 'text' && field.required;
    const labelContent = required ? `${field.label} *` : field.label;

    if (field.type === 'textarea') {
      return (
        <div key={field.name} className={getClass(field.className)}>
          <label className={styles['form-fields__label']}>
            {labelContent}
            <textarea
              value={(value as string) ?? ''}
              onChange={(e) => onChange(field.name, e.target.value)}
              rows={field.rows ?? 2}
              className={styles['form-fields__input']}
            />
          </label>
        </div>
      );
    }

    if (field.type === 'number') {
      return (
        <div key={field.name} className={getClass(field.className)}>
          <label className={styles['form-fields__label']}>
            {labelContent}
            <input
              type="number"
              min={field.min}
              max={field.max}
              step={field.step}
              value={(value as number) ?? ''}
              onChange={(e) => onChange(field.name, e.target.valueAsNumber)}
              className={styles['form-fields__input']}
            />
          </label>
        </div>
      );
    }

    return (
      <div key={field.name} className={getClass(field.className)}>
        <label className={styles['form-fields__label']}>
          {labelContent}
          <input
            type="text"
            value={(value as string) ?? ''}
            onChange={(e) => onChange(field.name, e.target.value)}
            required={required}
            className={styles['form-fields__input']}
          />
        </label>
      </div>
    );
  };

  return (
    <>
      {fields.map((item, i) =>
        Array.isArray(item) ? (
          <div key={`row-${i}`} className={styles['form-fields__row']}>
            {item.map((field) => renderField(field))}
          </div>
        ) : (
          <Fragment key={item.name}>{renderField(item)}</Fragment>
        )
      )}
    </>
  );
}
FormFields.displayName = 'FormFields';
