import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User, MapPin, Users, Sparkles } from "lucide-react";

export interface UserProfile {
  name: string;
  location: string;
  gender: 'male' | 'female' | 'other';
  lookingFor: 'male' | 'female' | 'everyone';
}

interface UserProfileFormProps {
  onSubmit: (profile: UserProfile) => void;
}

const UserProfileForm = ({ onSubmit }: UserProfileFormProps) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState<'male' | 'female' | 'other'>('other');
  const [lookingFor, setLookingFor] = useState<'male' | 'female' | 'everyone'>('everyone');
  const [errors, setErrors] = useState<{ name?: string; location?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: { name?: string; location?: string } = {};
    if (!name.trim()) newErrors.name = "Please enter your name";
    if (!location.trim()) newErrors.location = "Please enter your location";
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({ 
      name: name.trim().slice(0, 50), 
      location: location.trim().slice(0, 50), 
      gender, 
      lookingFor 
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full p-6 text-center"
    >
      <motion.div
        className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-500 via-purple-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg"
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Sparkles className="w-10 h-10 text-white" />
      </motion.div>

      <h2 className="text-2xl font-bold text-foreground mb-2 bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
        Tell Us About You
      </h2>
      <p className="text-muted-foreground mb-6 max-w-sm">
        Help us find the perfect match for you!
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
        <div className="space-y-2 text-left">
          <Label htmlFor="name" className="flex items-center gap-2 text-foreground">
            <User className="w-4 h-4 text-pink-400" />
            Your Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
            className="bg-secondary/50 border-purple-500/30 focus:border-purple-400 focus:ring-purple-400/20"
          />
          {errors.name && <p className="text-destructive text-sm">{errors.name}</p>}
        </div>

        <div className="space-y-2 text-left">
          <Label htmlFor="location" className="flex items-center gap-2 text-foreground">
            <MapPin className="w-4 h-4 text-cyan-400" />
            Where Are You From?
          </Label>
          <Input
            id="location"
            placeholder="Enter your city/country..."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            maxLength={50}
            className="bg-secondary/50 border-cyan-500/30 focus:border-cyan-400 focus:ring-cyan-400/20"
          />
          {errors.location && <p className="text-destructive text-sm">{errors.location}</p>}
        </div>

        <div className="space-y-3 text-left">
          <Label className="flex items-center gap-2 text-foreground">
            <Users className="w-4 h-4 text-purple-400" />
            I am a...
          </Label>
          <RadioGroup
            value={gender}
            onValueChange={(v) => setGender(v as 'male' | 'female' | 'other')}
            className="flex gap-3"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Label
                htmlFor="gender-male"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  gender === 'male' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                <RadioGroupItem value="male" id="gender-male" className="sr-only" />
                👨 Boy
              </Label>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Label
                htmlFor="gender-female"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  gender === 'female' 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                <RadioGroupItem value="female" id="gender-female" className="sr-only" />
                👩 Girl
              </Label>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Label
                htmlFor="gender-other"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  gender === 'other' 
                    ? 'bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                <RadioGroupItem value="other" id="gender-other" className="sr-only" />
                🌟 Other
              </Label>
            </motion.div>
          </RadioGroup>
        </div>

        <div className="space-y-3 text-left">
          <Label className="flex items-center gap-2 text-foreground">
            <Users className="w-4 h-4 text-pink-400" />
            I want to talk to...
          </Label>
          <RadioGroup
            value={lookingFor}
            onValueChange={(v) => setLookingFor(v as 'male' | 'female' | 'everyone')}
            className="flex gap-3"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Label
                htmlFor="looking-male"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  lookingFor === 'male' 
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                <RadioGroupItem value="male" id="looking-male" className="sr-only" />
                👨 Boys
              </Label>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Label
                htmlFor="looking-female"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  lookingFor === 'female' 
                    ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                <RadioGroupItem value="female" id="looking-female" className="sr-only" />
                👩 Girls
              </Label>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Label
                htmlFor="looking-everyone"
                className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-all ${
                  lookingFor === 'everyone' 
                    ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500 text-white shadow-lg' 
                    : 'bg-secondary/50 hover:bg-secondary'
                }`}
              >
                <RadioGroupItem value="everyone" id="looking-everyone" className="sr-only" />
                🌈 Everyone
              </Label>
            </motion.div>
          </RadioGroup>
        </div>

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            type="submit" 
            size="xl" 
            className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 hover:from-pink-600 hover:via-purple-600 hover:to-cyan-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Find Someone
          </Button>
        </motion.div>
      </form>
    </motion.div>
  );
};

export default UserProfileForm;
