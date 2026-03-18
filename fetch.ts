async function fetchDoc() {
  try {
    const res = await fetch('https://docs.google.com/document/d/1PHeY4tKRuYi9hXOy0IG1ZdG5sYOeXkj3EwBoJxcMh-8/export?format=txt');
    const text = await res.text();
    console.log(text);
  } catch (err) {
    console.error(err);
  }
}
fetchDoc();
