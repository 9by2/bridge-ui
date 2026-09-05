import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Table>
      <UI.TableHeader>
        <UI.TableRow>
          <UI.TableHead>Component</UI.TableHead>
          <UI.TableHead>Status</UI.TableHead>
        </UI.TableRow>
      </UI.TableHeader>
      <UI.TableBody>
        <UI.TableRow>
          <UI.TableCell>Button</UI.TableCell>
          <UI.TableCell>Ready</UI.TableCell>
        </UI.TableRow>
      </UI.TableBody>
    </UI.Table>
  )
}
