import * as UI from "@bridge/ui"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 16 }}>
      <UI.DataState>
        <UI.DataStateTitle>No result</UI.DataStateTitle>
        <UI.DataStateDescription>
          ไม่มีข้อมูลที่ตรงกับตัวกรองปัจจุบัน ล้างตัวกรองหรือเลือกช่วงเวลาใหม่เพื่อดำเนินการต่อ
        </UI.DataStateDescription>
        <UI.DataStateAction>
          <UI.Button variant="outline">Clear filter</UI.Button>
        </UI.DataStateAction>
      </UI.DataState>
      <UI.DataState variant="error">
        <UI.DataStateMedia aria-hidden="true">!</UI.DataStateMedia>
        <UI.DataStateTitle>Unable to load account activity</UI.DataStateTitle>
        <UI.DataStateDescription>
          The application supplies this explanation and decides what the recovery action does.
        </UI.DataStateDescription>
        <UI.DataStateAction>
          <UI.Button variant="outline">Try again</UI.Button>
        </UI.DataStateAction>
      </UI.DataState>
    </div>
  )
}
