import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <UI.TableFrame density="compact">
      <UI.TableFrameHint>เลื่อนแนวนอนเพื่อดูคอลัมน์และการดำเนินการทั้งหมด</UI.TableFrameHint>
      <UI.TableFrameViewport tabIndex={0} aria-label="Account table">
        <div style={{ minWidth: 760 }}>
          <UI.Table>
            <UI.TableHeader>
              <UI.TableRow>
                <UI.TableHead>Account</UI.TableHead>
                <UI.TableHead>Status</UI.TableHead>
                <UI.TableHead>Very long ownership description</UI.TableHead>
              </UI.TableRow>
            </UI.TableHeader>
            <UI.TableBody>
              <UI.TableRow>
                <UI.TableCell>Jane Doe</UI.TableCell>
                <UI.TableCell>Active</UI.TableCell>
                <UI.TableCell>Company-wide package administrator with release review responsibility</UI.TableCell>
              </UI.TableRow>
            </UI.TableBody>
          </UI.Table>
        </div>
      </UI.TableFrameViewport>
    </UI.TableFrame>
  )
}
