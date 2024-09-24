import * as XLSX from 'xlsx';

 const generateTaskTemplate = () => {
  const rows = [
    {
      Level: '',
      TaskName: '',
      Weight: '',
      Floor: '',
      Basement: '',
      StartDate: '',
      Deadline: '',
      Description: '',
      AssignedUser: '',
    },
    {
      Level: '',
      TaskName: '',
      Weight: '',
      Floor: '',
      Basement: '',
      StartDate: '',
      Deadline: '',
      Description: '',
      AssignedUser: '',
    },
    {
      Level: '',
      TaskName: '',
      Weight: '',
      Floor: '',
      Basement: '',
      StartDate: '',
      Deadline: '',
      Description: '',
      AssignedUser: '',
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const headers = ['Level', 'TaskName', 'Weight', 'Floor', 'Basement', 'StartDate', 'Deadline', 'Description', 'AssignedUser'];
  XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Task Template');
  XLSX.writeFile(workbook, 'task_template.xlsx');
};
export default generateTaskTemplate;