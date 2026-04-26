import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  value?: string;
  onChange?: (value: string) => void;
};

export function ArticleCategorySelect({ value, onChange }: Props) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select category" />
      </SelectTrigger>

      <SelectContent>
        <SelectGroup>
          <SelectLabel>Tech</SelectLabel>
          <SelectItem value="technology">Technology</SelectItem>
          <SelectItem value="programming">Programming</SelectItem>
          <SelectItem value="web_dev">Web Development</SelectItem>
          <SelectItem value="mobile_dev">Mobile Development</SelectItem>
          <SelectItem value="ai_ml">AI / Machine Learning</SelectItem>
        </SelectGroup>

        <SelectSeparator />

        <SelectGroup>
          <SelectLabel>General</SelectLabel>
          <SelectItem value="business">Business / Startup</SelectItem>
          <SelectItem value="finance">Finance</SelectItem>
          <SelectItem value="health">Health</SelectItem>
          <SelectItem value="education">Education</SelectItem>
          <SelectItem value="lifestyle">Lifestyle</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}