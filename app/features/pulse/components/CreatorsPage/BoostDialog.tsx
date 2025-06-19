import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  setBoostDuration,
  setBoostLevel,
  applyBoost,
  resetModerationState,
} from "@/app/features/pulse/redux/creatorProfileSlice";
import { Creator } from "@/app/features/pulse/type";

interface BoostDialogProps {
  creator: Creator | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BoostDialog({ creator, open, onOpenChange }: BoostDialogProps) {
  const dispatch = useDispatch();
  const { boostDuration, boostLevel } = useSelector(
    (state: RootState) => state.creatorProfile
  );

  if (!creator) return null;

  const handleApplyBoost = () => {
    dispatch(
      applyBoost({
        creatorId: creator._id,
        duration: boostDuration,
        level: boostLevel,
      }) as any
    );
    dispatch(resetModerationState());
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Boost {creator.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 pt-4">
          <div className="space-y-4">
            <Label>Boost Level ({boostLevel}%)</Label>
            <Slider
              value={[boostLevel]}
              onValueChange={(value: number[]) =>
                dispatch(setBoostLevel(value[0]))
              }
              max={500}
              step={10}
            />
            <div className="grid grid-cols-5 gap-2 text-sm text-gray-500">
              <div>Normal</div>
              <div>2x</div>
              <div>3x</div>
              <div>4x</div>
              <div>5x</div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Duration (days)</Label>
            <div className="flex items-center gap-4">
              {[7, 14, 30].map((days) => (
                <Button
                  key={days}
                  variant={boostDuration === days ? "default" : "outline"}
                  onClick={() => dispatch(setBoostDuration(days))}
                >
                  {days} days
                </Button>
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleApplyBoost}
            disabled={!boostDuration || !boostLevel}
            className="bg-[#FF0000] hover:bg-[#CC0000]"
          >
            Apply Boost
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 