
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConsentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAccept: () => void;
  onDecline: () => void;
}

const ConsentDialog: React.FC<ConsentDialogProps> = ({
  open,
  onOpenChange,
  onAccept,
  onDecline,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Разрешение на участие в рейтинге</DialogTitle>
          <DialogDescription>
            Ваши данные об успеваемости будут сохранены локально для отображения в рейтинге студентов.
            Вы можете в любой момент удалить свои данные из рейтинга в профиле.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2 mt-5">
          <Button variant="outline" onClick={onDecline}>
            Отклонить
          </Button>
          <Button onClick={onAccept}>
            Разрешить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConsentDialog;
