const quill = new Quill('#editor', {
  modules: {
    toolbar: [
      [{header: [1, 2, false]}],
      ['bold', 'italic', 'underline'],
      ['code-block'],
    ],
  },
  placeholder: 'Compose an epic...',
  theme: 'snow',
})

const form = document.querySelector('form')
form.onsubmit = function() {
  if (quill.getLength() === 1) {
    return false
  }
  const content = document.querySelector('input[name=content]')
  content.value = quill.root.innerHTML
  return true
}
