import { LinearProgress } from "@mui/material";
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';

/**k는 지수함수의 밑 */
export default function ExpBar({expDateStr, k}:{expDateStr:string, k:number}){
    const now:Date = new Date();
    const expDate:Date = new Date(expDateStr);
    expDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0)

    const dateDiff: number = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24); //남은 일수

    let y = Math.pow((1/1.15), dateDiff)

    if(y < 0.0001){
        y = 0;
    }
    if(dateDiff >= 14){ //14일부터 감소 시작
        y = 0;
    }

    const progressVal = 1-y
    const normalise = (value:number) => (value * 100);

    let color = "";
    if(progressVal < 0.3){
        color = '#ad0707';
    }else if(progressVal < 0.6){
        color = '#ffb300'
    }else{
        color = '#38c54b'
    }


    const dateDiffString = dateDiff > 0?`${dateDiff}일 남음`:"만료"
    return (
        <div className="mx-1 h-[30px]">
            <p className="flex items-center text-[0.6rem] justify-start font-normal">
                <AccessAlarmIcon sx={{width:"1rem", height:"1rem", marginRight:"0.1rem", marginBottom:"0.1rem"}}/>
                {dateDiffString}
            </p> 
            <LinearProgress sx={{
                '& .MuiLinearProgress-bar': {
                    backgroundColor: color,
                },
            }}
            variant="determinate" value={normalise(progressVal)} />
        </div>

    )

}