# Prompt pour l'extraction de l'Architecture (Cursor Operating Model)

Copie ce prompt et donne-le à Cursor pour analyser ton projet et générer les données du graphe.

---

**Role:** Tu es un Architecte Logiciel Senior expert en rétro-ingénierie et en documentation système.

**Objectif:** Analyser l'ensemble des fichiers du projet actuel (code source, documentation .md, scripts, configurations) pour extraire une cartographie complète de l'architecture sous forme de données structurées JSON compatibles avec mon application de visualisation React.

**Contexte:** Je veux visualiser :
1. **Les Agents principaux** (Main Agent - point d'entrée).
2. **Les Team Squads** (Agents orchestrateurs intermédiaires).
3. **Les Sub-Agents** (Agents spécialisés).
4. **Les Skills** (Scripts, Wrappers CLI, Fonctions utilitaires).
5. **Les MCPs** (Model Context Protocol servers, APIs externes, Bases de données).
6. **Les Relations** (Qui appelle qui ? - **optionnelles et non hiérarchiques strictes**).
7. **Les Scénarios** (Exemples de workflows étape par étape).

**Architecture hiérarchique (flexible) :**
```
Main Agent (point d'entrée)
    ↓ (optionnel)
Team Squad (Orchestrateur)
    ↓ (optionnel)
Sub Agent (Spécialisé)
    ↓ (optionnel)
MCP (Service externe)
```

**Important :** Les couches peuvent être bypassées. Par exemple :
- Un Main Agent peut appeler directement un MCP
- Un Team Squad peut appeler directement un MCP
- Un Sub Agent peut appeler un autre Sub Agent
- Les liens ne sont pas obligatoires

**Tâche 1 : Identification des Nœuds (`NODES`)**
Parcours les fichiers et identifie les composants. Pour chaque composant, génère un objet JSON suivant cette structure TypeScript :
```typescript
interface NodeData {
  id: string;          // ID unique (ex: "cicd-agent")
  label: string;       // Nom affiché (ex: "CI/CD Agent")
  type: "MAIN_AGENT" | "TEAM_SQUAD" | "SUB_AGENT" | "SKILL" | "MCP";
  description: string; // Courte description (max 2 phrases) extraite du code ou des docs.
  color: string;       // Choisir parmi: 'cyan', 'green', 'magenta', 'blue', 'slate', 'amber', 'violet', 'orange', 'rose'.
  iconName: string;    // Choisir un nom d'icône Lucide React pertinent (ex: 'Database', 'Bot', 'Terminal', 'Cloud', 'Mail', 'Github', 'Users', 'Workflow').
  contextFile?: string;// Fichier source principal ou documentation associée (ex: "readme.md", "agent.py").
  skills?: string[];   // Liste des skills associés à ce nœud (IDs des nœuds de type SKILL).
  contextFiles?: string[]; // Liste des fichiers de contexte utilisés par ce nœud (chemins relatifs).
}
```

*Règles de classification :*
*   **MAIN_AGENT** : Le point d'entrée principal de l'architecture.
*   **TEAM_SQUAD** : Un agent orchestrateur intermédiaire qui coordonne plusieurs sub-agents (ex: "Backend Squad", "Data Squad").
*   **SUB_AGENT** : Les agents spécialisés qui effectuent des tâches spécifiques (ex: DBA, DevOps, PM).
*   **SKILL** : Les outils spécifiques, scripts python, wrappers CLI, fonctions d'export qui peuvent être attachés à n'importe quel type d'agent.
*   **MCP** : Les services externes (GitHub, Azure, Notion, Gemini, Browser, APIs, Bases de données).

**Tâche 2 : Identification des Liens (`LINKS`)**
Analyse les imports et les appels de fonctions pour déterminer les dépendances. **Les liens sont optionnels** et ne doivent représenter que les relations réelles découvertes dans le code.
```typescript
interface LinkData {
  source: string; // ID du nœud appelant
  target: string; // ID du nœud appelé
}
```

**Note importante:** Les liens peuvent traverser les couches de manière non linéaire. Par exemple :
- MAIN_AGENT → MCP (bypass de TEAM_SQUAD et SUB_AGENT)
- TEAM_SQUAD → MCP (bypass de SUB_AGENT)
- SUB_AGENT → SUB_AGENT (communication entre agents de même niveau)

**Tâche 3 : Identification des Scénarios (`SCENARIOS`)**
Déduis 2 ou 3 cas d'utilisation réalistes basés sur les fonctionnalités du code (ex: "Deploy to Production", "Update Database", "Generate Report").
```typescript
interface InteractionFlow {
  id: string;
  title: string;
  description: string;
  steps: {
    label: string; // Nom de l'action (ex: "API Call", "Write File")
    from: string;  // ID source
    to: string;    // ID cible
    description: string; // Détail de l'action
  }[];
}
```

**Output attendu :**
Ne me donne pas de code markdown ou d'explications. Donne-moi **uniquement** un bloc de code JSON contenant les 3 tableaux remplis avec les données réelles de mon projet :
```json
{
  "NODES": [...],
  "LINKS": [...],
  "SCENARIOS": [...]
}
```
---