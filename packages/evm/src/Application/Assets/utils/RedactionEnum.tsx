export enum RedactionStatus {
    SubmitForAnalysis = 1
}

export enum ProjectStateEnum {
  Submit = 1,
  Analyzing = 10,
  "Analysis Ready" = 20,
  Review = 30,
  Processing = 40,
  Redacting = 50,
  Closed = 60,
  Duplicating = 70
}

export enum ProjectStatusEnum{
  Active=1,
  Closed=2,
  Expired=3
}

export enum ProjectTypeEnum {
  "Video Analyzing" = 0,
  "Audio Analyzing" = 1,
  Exporting = 2
}
