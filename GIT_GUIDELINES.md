## 🪴 Branch Naming Convention

To keep our Git history clean and easy to understand, please follow this branch naming convention when working on this SDK:

### 📌 Format

```
<type>/<short-description>
```

- Use lowercase and kebab-case (`-`) for readability.
- Keep the description concise but clear.

---

### ✅ Common Branch Types

| Type       | Purpose                                               | Example                         |
| ---------- | ----------------------------------------------------- | ------------------------------- |
| `feature`  | For new features or enhancements                      | `feature/add-carousel-node`     |
| `fix`      | For bug fixes                                         | `fix/fix-response-overlap`      |
| `docs`     | For updating documentation                            | `docs/update-readme-examples`   |
| `chore`    | For routine tasks (e.g., version bumps, build tweaks) | `chore/bump-dependencies`       |
| `refactor` | For code improvements without behavior changes        | `refactor/clean-message-parser` |
| `test`     | For adding or updating tests                          | `test/add-node-parser-tests`    |
| `ci`       | For CI/CD pipeline or config updates                  | `ci/fix-github-actions-cache`   |

---

### 🧪 Example Scenarios

- Adding a new node type:  
  `feature/image-node-support`

- Fixing layout in mobile view:  
  `fix/mobile-layout-bug`

- Updating README with usage instructions:  
  `docs/add-usage-guide`

- Refactoring message parsing utilities:  
  `refactor/optimize-parser-utils`

---

### 🙌 Tips

- Prefixing helps organize pull requests by type.
- Descriptions should match the purpose of the branch.
- If in doubt, check recent branches or ask the team.
