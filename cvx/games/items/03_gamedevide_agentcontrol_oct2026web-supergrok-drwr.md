**Key takeaway:** The past 12 months have produced a clear shift toward agent-native control. Unity (official CLI + Pipeline package, July 2026) and Unreal (official MCP in 5.8, June 2026) now ship first-party tools explicitly built for structured CLI/HTTP interaction and AI agents. Blender has an official Lab MCP server plus a dense community ecosystem; Godot has strong FOSS CLI/MCP options (Swallowtail, gda, multiple Asset Library plugins); Phaser centers on its Game Agent MCP for end-to-end generative games; Construct 3 relies on JSON-project mutation + RAG-style API tools.

The full report is saved and ready for download:




### High-level map (by engine)

| Engine | Standout 2026 tools | Best for agents / CLI | Content pipelines | Notes |
|--------|---------------------|-----------------------|-------------------|-------|
| **Unity** | Official Unity CLI + `com.unity.pipeline`, official agent skills/plugin, CoplayDev & IvanMurzak MCPs | Excellent (live Editor + eval, JSON, custom `[CliCommand]`) | AI generators + Asset Transformer | Strongest official agent story |
| **Unreal** | Official Unreal MCP (5.8, experimental), Python commandlets, many third-party MCPs | Excellent (hundreds of tools, Blueprints, Remote Control) | MCP + Python for assets/materials/Niagara | Official MCP is new and experimental |
| **Blender** | Official Blender Lab MCP (5.1+), dcc-mcp-blender (200+ tools), mcp-for-blender + generative bridges | Excellent (headless `--background` + live) | Strongest generative 3D integrations | Official is lighter; community is deeper |
| **Godot** | Swallowtail (CLI + MCP), gda (CLI/skill/MCP), various Asset Library MCPs | Excellent (live Editor or headless) | Community agents + native CLI | No official MCP; pure FOSS |
| **Phaser 3** | Phaser Game Agent MCP, Phaser Editor MCP | Good for generative whole-game | Prompt → code/art/sound + source export | Cloud-first; less classic IDE control |
| **Construct 3** | construct3-chef (MCP + recipes), Construct3-RAG skills | Good for event-sheet / JSON mutation | File-level + validation loops | Event-sheet model fits agents well once knowledge layer is in place |

### UVP snapshot
- **Headless Pipeline Orchestration**: Unity CLI, Unreal UAT/commandlets, Blender `--background`, Godot `--headless`, GameCI  
- **LLM-Native Editor Control**: Unity Pipeline + skills, Unreal MCP, Blender Lab + dcc-mcp / mcp-for-blender, Godot Swallowtail/gda, Phaser Game Agent, construct3-chef  
- **Rapid Prototyping / Generative**: Phaser Game Agent, Unity in-editor AI, Unreal MCP demos  
- **Automated QA**: Unity CLI tests/screenshots, Godot Stagehand/Swallowtail, Unreal automation tests  
- **Asset Generation**: Blender MCP bridges (Hyper3D etc.), Unity AI generators, external services + import  

**Practical recommendation for a customized agent:** Prefer tools that expose structured CLI or HTTP/JSON APIs with live observation (screenshots, scene state, test results) and clear permission models. Start with Unity’s official CLI/Pipeline or Unreal’s 5.8 MCP if you are already on those engines; use Godot’s Swallowtail or gda for lightweight open-source control; treat Blender MCPs as the asset-pipeline backend that feeds the others.

The report expands on every engine with categories (official / FOSS / third-party), concrete tool names, integration styles, safety notes, and open questions. Let me know if you want a deeper dive on any single engine, a comparison matrix for agent readiness, or setup sketches.
