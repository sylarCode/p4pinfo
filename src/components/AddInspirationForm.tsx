"use client";

import { useRef, useTransition } from "react";
import { addInspiration } from "@/app/actions";

type Category = {
  id: string;
  name: string;
};

export function AddInspirationForm({ categories }: { categories: Category[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      ref={formRef}
      className="add-form"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          await addInspiration(formData);
          formRef.current?.reset();
        });
      }}
    >
      <h3>Add an inspiration</h3>
      <p className="add-form__lede">
        Drop something under a creator-managed category and tag what makes it
        yours.
      </p>

      <label>
        <span>Category</span>
        <select name="categoryId" required defaultValue="">
          <option value="" disabled>
            Choose a category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Title</span>
        <input
          name="title"
          required
          placeholder='e.g. The Meat Emporium'
        />
      </label>

      <label>
        <span>Location</span>
        <input name="location" placeholder="Bali, Indonesia" />
      </label>

      <label>
        <span>Notes</span>
        <textarea
          name="description"
          rows={3}
          placeholder="What should a friend know?"
        />
      </label>

      <label>
        <span>Tags</span>
        <input
          name="tags"
          placeholder="beef tallow, animal based diet"
        />
      </label>

      <button type="submit" className="btn btn--primary" disabled={pending}>
        {pending ? "Saving…" : "Save inspiration"}
      </button>
    </form>
  );
}
