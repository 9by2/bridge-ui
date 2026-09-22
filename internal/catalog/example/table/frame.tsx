import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.Table variant="frame" density="compact">
      <UI.TableHint>Scroll horizontally to view all columns and actions.</UI.TableHint>
      <UI.TableViewport tabIndex={0} aria-label="Account table">
        <div style={{ minWidth: 760 }}>
          <table>
            <UI.TableHeader>
              <UI.TableRow>
                <UI.TableHead>Account</UI.TableHead>
                <UI.TableHead>Status</UI.TableHead>
                <UI.TableHead>Ownership</UI.TableHead>
              </UI.TableRow>
            </UI.TableHeader>
            <UI.TableBody>
              <UI.TableRow>
                <UI.TableCell>Jane Doe</UI.TableCell>
                <UI.TableCell>Active</UI.TableCell>
                <UI.TableCell>Company-wide package administrator</UI.TableCell>
              </UI.TableRow>
            </UI.TableBody>
          </table>
        </div>
      </UI.TableViewport>
    </UI.Table>
  )
}
