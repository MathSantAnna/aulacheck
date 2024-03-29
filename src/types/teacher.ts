export type ITeachers = ITeacher[];

  type ICousers = {
    nmcourse: string;
    uuidcourse: string;
  }

  type ITeacher = {
    uuidteacher: string;
    nmteacher: string;
    email: string;
    created_at: string;
    updated_at: string;
    courses: ICousers[];
  }