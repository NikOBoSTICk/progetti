package it.niko.game.command;

import it.niko.game.model.Game;

public class ManualCommand implements Command {

    private final Game game;

    public ManualCommand(Game game) {
        this.game = game;
    }

    @Override
    public boolean execute() {
        if(game.isFinish())
            return false;
        game.nextRound();
        return true;
    }
}
